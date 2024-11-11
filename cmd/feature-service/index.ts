import { createFeatureService } from "./create-feature-service.ts";
import { deleteFeatureService } from "./delete-feature-service.ts";
import { listFeatureServices } from "./list-feature-services.ts";

export function featureServiceCommand(
  command: string | number,
) {
  switch (command) {
    case "create": {
      createFeatureService();
      break;
    }
    case "delete": {
      deleteFeatureService();
      break;
    }
    case "list": {
      listFeatureServices();
      break;
    }
    case "help": {
      console.log("ArcGIS CLI - Feature service");
      console.log("Usage:");
      console.log("\t$ arcgis-cli feature-service [command] [--flags]")
      console.log("\nAvailable commands are:");
      console.log("\tcreate \t create feature service");
      console.log("\tdelete \t delete feature service");

      console.log("\nTo see the available flags available for each command you can run");
      console.log("\t$ arcgis-cli feature-service [command] --help");
      break;
    }
    default: {
      console.log("Unknown command");
      Deno.exit(2);
    }
  }
}
