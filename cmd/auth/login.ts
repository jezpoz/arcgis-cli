import { parseArgs, promptSecret } from "@std/cli";
import { readContextFile } from "../../utils/context-utils.ts";
import { writeTokenFile, writeProfileFile } from "../../utils/auth-utils.ts";

type ITokenResponse = ITokenSuccess | ITokenError;
type ITokenSuccess = {
  token: string;
  expires: number;
  ssl: boolean;
};
type ITokenError = {
  error: {
    code: number;
    message: string;
    details: string[];
  };
};

type IProfileResponse = IProfileSuccess | IProfileError;
type IProfileSuccess = {
  username: string;
  udn: any;
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  created: number;
  modified: number;
  provider: string;
};
type IProfileError = {
  error: {
    code: number;
    messageCode: string;
    message: string;
    details: string[];
  }
};

export async function login() {
  const context = await readContextFile();
  const activeContext = context.contexts.find((c) =>
    c.name === context.activeContext
  );
  if (!activeContext) {
    console.log("No active context");
    Deno.exit(3);
  }
  let username: string | null = null, password: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      u: "username",
      p: "password",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Auth - Login  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli auth login [--flags]\x1b[0m");
    console.log(
      "\t The CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--username, -u\x1b[0m");
    console.log("\t\x1b[34m--password, -p\x1b[0m");

    Deno.exit(0);
  }
  if (args.username) {
    username = args.username;
  } else {
    while (!username) {
      username = prompt("Username:");
    }
  }
  if (args.password) {
    password = args.password;
  } else {
    while (!password) {
      password = promptSecret("Password:");
    }
  }

  try {
    const generateTokenEndpoint = new URL(
      "/portal/sharing/rest/generateToken",
      activeContext.portalUrl,
    );

    generateTokenEndpoint.searchParams.append("f", "json");

    const formData = new FormData();
    formData.append("username", username!);
    formData.append("password", password!);
    formData.append("client", "requestip");
    formData.append("ip", "");
    formData.append("referer", "");
    formData.append("expiration", "21600");

    const response = await fetch(generateTokenEndpoint, {
      method: "POST",
      body: formData,
    });
    const token = await response.json() as ITokenResponse;
    if (!(token as ITokenError).error) {
      await writeTokenFile({
        token: (token as ITokenSuccess).token,
        expires: (token as ITokenSuccess).expires,
        ssl: (token as ITokenSuccess).ssl,
      });
    } else {
      throw new Error(
        `${(token as ITokenError).error.message}
      ${(token as ITokenError).error.details.join("\n")}`,
      );
    }

    const profileEndpoint = new URL(
      `/portal/sharing/rest/community/users/${username}`,
      activeContext.portalUrl,
    );
    profileEndpoint.searchParams.append("f", "json");

    const profileResponse = await fetch(profileEndpoint);
    const profileJson = await profileResponse.json() as IProfileResponse;
    if (!(profileJson as IProfileError).error) {
      const profile = profileJson as IProfileSuccess;
      await writeProfileFile({...profile});
    }
  } catch (err) {
    console.error("Lets go", err);
  }
}
