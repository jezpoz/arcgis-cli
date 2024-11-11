import { parseArgs } from "@std/cli";
import {
  readContextFile,
  writeContextFile,
  IArcGISCLIContextFileContent,
} from "../../utils/context-utils.ts";

export async function createContext() {
  let name: string | null = null, portalUrl: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      n: "name",
      p: "portal-url",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Context - Create  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli context create\x1b[0m");
    console.log(
      "\t The CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--name, -n\x1b[0m");
    console.log(
      '\t\t Name of the context. If the name contains spaces, wrap it in quotes "".',
    );
    console.log("\t\x1b[34m--portal-url, -p\x1b[0m");
    console.log(
      "\t\t ArcGIS Portal URL.",
    );

    Deno.exit(0);
  }
  if (args.name) {
    name = args.name;
  } else {
    while (!name) {
      name = prompt("Context name:");
    }
  }
  if (args["portal-url"]) {
    portalUrl = args["portal-url"];
  } else {
    while (!portalUrl) {
      portalUrl = prompt("Portal URL:");
    }
  }

  let context: IArcGISCLIContextFileContent | null;
  try {
    context = await readContextFile()
  } catch (_err) {
    context = {
      contexts: [],
      activeContext: "",
    }
  }

  context.contexts.push({
    name: name!,
    portalUrl: portalUrl!,
  });

  if (!context.activeContext) {
    context.activeContext = name!;
  }

  await writeContextFile(context);
}
