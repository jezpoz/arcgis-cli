import { parseArgs } from "@std/cli";

import { readContextFile } from "../../utils/context-utils.ts"
import { readTokenFile, readProfileFile } from "../../utils/auth-utils.ts";

interface ICreateParameters {
  name: string;
  serviceDescription?: string;
  hasStaticData?: boolean;
  maxRecordCount?: number;
  supportedQueryFormats?: string;
  capabilities?: string;
  description?: string;
  copyrightText?: string;
  spatialReference?: {
    wkid?: number;
  };
  initialExtent?: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    spatialReference?: {
      wkid: number;
      latestWkid: number;
    }
  };
  allowGeometryUpdates?: boolean;
  units?: string;
  xssPreventionInfo?: {
    xssPreventionEnabled: boolean;
    xssPreventionRule: string;
    xssInputRule: string;
  }
}

interface ICreateFeatureServiceResponse {
  success: boolean;
  error?: {
    message: string;
  };
  description?: string;
  tags?: string;
  snippet?: string;
  isView?: boolean;
  encodedServiceURL?: string;
  itemId?: string;
  name?: string;
  serviceItemId?: string;
  serviceurl?: string;
  size?: number;
  type?: string;
  typeKeywords?: string[];
}

export async function createFeatureService() {
  let name: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      n: "name",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Feature Service - Create  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli feature-service create\x1b[0m");
    console.log(
      "\t The CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--name, -n\x1b[0m");
    console.log(
      '\t\t Name of the feature service. If the name contains spaces, wrap it in quotes "".',
    );

    Deno.exit(0);
  }
  if (args.name) {
    name = args.name;
  } else {
    while (!name) {
      name = prompt("Feature service name:");
    }
  }

  const context = await readContextFile();
  const token = await readTokenFile();
  const profile = await readProfileFile();

  const activeContext = context.contexts.find(c => c.name === context.activeContext);
  if (!activeContext) {
    Deno.exit(3);
  }

  const createServiceEndpoint = new URL(
    `/portal/sharing/rest/content/users/${profile.username}/createService`,
    activeContext.portalUrl,
  );
  createServiceEndpoint.searchParams.append("token", token.token);
  createServiceEndpoint.searchParams.append("f", "json");

  const createParameters: ICreateParameters = {
    name: name!,
  }

  const formData = new FormData();
  formData.append("createParameters", JSON.stringify(createParameters));
  formData.append("outputType", "featureService");
  formData.append("description", "description");
  formData.append("tags", "tags");
  formData.append("snippet", "snippet");
  formData.append("overwrite", false.toString());
  formData.append("isView", false.toString());
  formData.append("f", "json");

  const createFeatureServiceResponse = await fetch(createServiceEndpoint, {
    method: 'POST',
    body: formData,
  });
  if (createFeatureServiceResponse.status === 200) {
    const createFeatureServiceJson = await createFeatureServiceResponse.json() as ICreateFeatureServiceResponse;
    if (createFeatureServiceJson.success) {
      console.log("Created new feature service:");
      console.log("Name: ",createFeatureServiceJson.name);
      console.log("ID: ", createFeatureServiceJson.itemId);
    } else {
      console.log("Error while creating feature service");
      console.log(createFeatureServiceJson.error?.message);
    }
  }
}