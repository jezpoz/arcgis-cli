import { createFeatureLayer } from "./create-feature-layer.ts";
import { deleteFeatureLayer } from "./delete-feature-layer.ts";

export function featureLayerCommand(
  command: string | number,
) {
  switch (command) {
    case "create": {
      createFeatureLayer();
      break;
    }
    case "delete": {
      deleteFeatureLayer();
      break;
    }
    default: {
      if (command === "") {
        console.log("Unknown command");
        console.log("\nArcGIS CLI - Feature layers");
      } else {
        console.log("ArcGIS CLI - Feature layers");
      }

      console.log(`Usage:
    arcgis-cli feature-layer [command] [--flags]

  Available commands are:
    create \t create feature layer
    delete \t delete feature layer

  To see the available flags available for each command you can run
    $ arcgis-cli feature-layer [command] --help
  `);
      Deno.exit(2);
    }
  }
}
