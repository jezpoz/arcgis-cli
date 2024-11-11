import { parseArgs } from "@std/cli";

import { readContextFile } from "../../utils/context-utils.ts"
import { readTokenFile, readProfileFile } from "../../utils/auth-utils.ts";

interface IFeatureServiceDeleteResponse {
  results: {
    itemId: string;
    success: boolean;
    error?: {
      code: number;
      message: string;
    }
  }[];
}

export async function deleteFeatureService() {
  let serviceId: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      i: "service-id",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Feature Service - Delete  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli feature-service delete\x1b[0m");
    console.log(
      "\t The CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--service-id, -i\x1b[0m");
    console.log(
      '\t\t ID of the feature service.',
    );

    Deno.exit(0);
  }
  if (args.i || args["service-id"]) {
    serviceId = args.i || args["service-id"];
  } else {
    while (!serviceId) {
      serviceId = prompt("Feature service ID:");
    }
  }

  const context = await readContextFile();
  const token = await readTokenFile();
  const profile = await readProfileFile();

  const activeContext = context.contexts.find(c => c.name === context.activeContext);
  if (!activeContext) {
    Deno.exit(3);
  }

  const featureServiceDeleteEndpoint = new URL(
    `/portal/sharing/rest/content/users/${profile.username}/deleteItems`,
    activeContext.portalUrl,
  );
  featureServiceDeleteEndpoint.searchParams.append("token", token.token);
  featureServiceDeleteEndpoint.searchParams.append("f", "json");
  featureServiceDeleteEndpoint.searchParams.append("type", "Feature Service");
  featureServiceDeleteEndpoint.searchParams.append("items", serviceId!);

  const featureServiceDeleteResponse = await fetch(featureServiceDeleteEndpoint, {
    method: 'POST',
  });
  if (featureServiceDeleteResponse.status === 200) {
    const featureServiceDeleteJson = await featureServiceDeleteResponse.json() as IFeatureServiceDeleteResponse;
    console.log("Delete results:");
    for (const item of featureServiceDeleteJson.results) {
      if (item.success) {
        console.log("\t- Successfully deleted feature service with id: ", item.itemId);
      } else {
        console.log("\t- Error while deleting feature service with id: ", item.itemId);
        console.log("\t ", item.error?.message)
      }
    }
  }
}