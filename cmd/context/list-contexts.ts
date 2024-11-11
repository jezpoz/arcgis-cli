import { parseArgs } from "@std/cli";
import { readContextFile } from "../../utils/context-utils.ts";

export async function listContexts() {
  const contextFile = await readContextFile();
  const args = parseArgs(Deno.args, {
    alias: {
      n: "name",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Context - List  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli context delete\x1b[0m");
    console.log(
      "\tThe CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--name, -n\x1b[0m");
    console.log(
      '\t\tName of the context. If the name contains spaces, wrap it in quotes "".',
    );
    console.log(
      "\t\tIf this flag is used, it will also show the ArcGIS Portal URL",
    );

    Deno.exit(0);
  }
  if (args.name) {
    const contexts = contextFile.contexts.filter((c) => c.name === args.name);
    console.log("Contexts");
    for (const context of contexts) {
      console.log(`\t - ${context.name}`);
      console.log(`\t   URL: ${context.portalUrl}`);
    }
  } else {
    console.log("Contexts");
    for (const context of contextFile.contexts) {
      console.log(`\t - ${context.name}`);
    }
  }
}
