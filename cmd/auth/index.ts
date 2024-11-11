import { login } from "./login.ts";

export async function authCommand(command: string | number) {
  switch (command) {
    case "login": {
      await login();
      break;
    }
    default: {
      if (command !== "") {
        console.log("Unknown command");
        console.log("\nArcGIS CLI - Auth");
      } else {
        console.log("ArcGIS CLI - Auth");
      }
      console.log("Usage:");
      console.log("\t arcgis-cli auth [commands] [--flags]");
      console.log("\nAvailable commands are:");
      console.log("\t login \t log in to the portal for the current context");

      console.log(
        "\nTo see the available flags available for each command you can run",
      );
      console.log("\t$ arcgis-cli auth [command] --help");
      Deno.exit(2);
    }
  }
}
