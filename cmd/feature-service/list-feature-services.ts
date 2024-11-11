import { parseArgs } from "@std/cli";

import { readContextFile } from "../../utils/context-utils.ts"
import { readTokenFile, readProfileFile } from "../../utils/auth-utils.ts";

interface IFeatureService {
  id: string;
  owner: string;
  created: number;
  isOrgItem: boolean;
  modified: number;
  guid?: string;
  name: string;
  title: string;
  type: string;
  typeKeywords: string[];
  description?: string;
  tags?: string[];
  snippet?: string;
  thumbnail?: string;
  documentation?: string;
  extent?: any[];
  categories?: string;
  spatialReference?: any;
  accessInformation?: any;
  classification?: any;
  licenseInfo?: string;
  culture: string;
  properties?: any;
  advancedSettings?: any;
  url: string;
  proxyFilter?: any;
  access: string;
  size: number;
  subInfo: number;
  appCategories: any[];
  industries: any[];
  langauges: any[];
  largeThumbnail?: string;
  banner?: string;
  screenshots: any[];
  listed: boolean;
  ownerFolder?: string;
  protected: boolean;
  numComments: number;
  numRatings: number;
  avgRating: number;
  numViews: number;
  scoreCompleteness: number;
  groupDesignations?: any;
  token1ExpirationDate: number;
  token2ExpirationDate: number;
  lastViewed: number;
}

interface IFeatureServiceSearchResponse {
  username: string;
  total: number;
  start: number;
  num: number;
  nextStart: number;
  currentFolder?: string;
  items: IFeatureService[];
  folders: any[];
}

export async function listFeatureServices() {
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
  }

  const context = await readContextFile();
  const token = await readTokenFile();
  const profile = await readProfileFile();

  const activeContext = context.contexts.find(c => c.name === context.activeContext);
  if (!activeContext) {
    Deno.exit(3);
  }

  const featureServiceSearchEndpoint = new URL(
    `/portal/sharing/rest/content/users/${profile.username}`,
    activeContext.portalUrl,
  );
  featureServiceSearchEndpoint.searchParams.append("token", token.token);
  featureServiceSearchEndpoint.searchParams.append("f", "json");
  featureServiceSearchEndpoint.searchParams.append("type", "Feature Service");

  const featureServiceSearchResponse = await fetch(featureServiceSearchEndpoint);
  if (featureServiceSearchResponse.status === 200) {
    const featureServiceSearchJson = await featureServiceSearchResponse.json() as IFeatureServiceSearchResponse;
    console.log("Feature Services:");
    for (const service of featureServiceSearchJson.items) {
      if (name) {
        if (service.name === name) {
          console.log("\t- Name:\t", service.name);
          console.log("\t  ID: \t", service.id);
          console.log("\t  URL: \t", service.url);
        }
      } else {
        console.log("\t- Name:\t", service.name);
        console.log("\t  ID: \t", service.id);
        console.log("\t  URL: \t", service.url);
      }
    }
  }
}