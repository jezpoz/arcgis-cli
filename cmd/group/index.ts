import { listGroups } from "./list-groups.ts";

export async function groupCommand(
  command: string | number,
) {
  switch (command) {
    case "list": {
      await listGroups();
      break;
    }
    case "help": {
      console.log("ArcGIS CLI - Group");
      console.log("Usage:");
      console.log("\t$ arcgis-cli group [command] [--flags]")
      console.log("\nAvailable commands are:");
      console.log("\tlist \t create feature service");

      console.log("\nTo see the available flags available for each command you can run");
      console.log("\t$ arcgis-cli group [command] --help");
      break;
    }
    default: {
      console.log("Unknown command");
      Deno.exit(2);
    }
  }
}