import { createContext } from "./create-context.ts";
import { listContexts } from "./list-contexts.ts";
import { deleteContext } from "./delete-context.ts";

export function contextCommand(command: string | number) {
  switch (command) {
    case "create": {
      createContext();
      break;
    }
    case "list": {
      listContexts();
      break;
    }
    case "delete": {
      deleteContext();
      break;
    }
    default: {
      if (command === "") {
        console.log("Unknown command");
        console.log("\nArcGIS CLI - Context");
      } else {
        console.log("ArcGIS CLI - Context");
      }

      console.log(`Usage:
    arcgis-cli context [command] [--flags]

  Available commands are:
    create \t create a new context
    list \t lists all contexts
    delete \t deletes contexts

  To see the available flags available for each command you can run
    $ arcgis-cli context [command] --help
  `);
      Deno.exit(2);
    }
  }
}
