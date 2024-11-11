import { parseArgs } from "@std/cli";

import { contextCommand } from "./cmd/context/index.ts";
import { featureLayerCommand } from "./cmd/feature-layer/index.ts";
import { authCommand } from "./cmd/auth/index.ts";
import { featureServiceCommand } from "./cmd/feature-service/index.ts";
import { groupCommand } from "./cmd/group/index.ts";

const args = parseArgs(Deno.args);

const [resource, command] = args._;

switch (resource) {
  case "auth": {
    authCommand(command);
    break;
  }
  case "context": {
    contextCommand(command);
    break;
  }
  case "folder": {
    break;
  }
  case "group": {
    groupCommand(command);
    break;
  }
  case "feature-layer": {
    featureLayerCommand(command);
    break;
  }
  case "feature-service": {
    if (args.help && !command) {
      featureServiceCommand("help");
    } else {
      featureServiceCommand(command);
    }
    break;
  }
  default: {
    if (resource) {
      console.log("Unknown command");
      Deno.exit(1);
    }

    console.log("ArcGIS CLI");
    console.log("Usage:");
    console.log("\t$ arcgis-cli [resource] [command] [--flags]");
    console.log("\nAvailable resources are:");
    console.log("\tauth");
    console.log("\tcontext");
    console.log("\tfolder");
    console.log("\tgroup");
    console.log("\tfeature-layer");
    console.log("\tfeature-service");

    console.log(
      "\nTo see the commands available for each resources you can run",
    );
    console.log("\t$arcgis-cli [resource]");
    console.log("\tor");
    console.log("\t$arcgis-cli [resource] -h, or --help");
  }
}
