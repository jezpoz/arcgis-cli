import { parseArgs } from "@std/cli";
import {
  readContextFile,
  writeContextFile,
} from "../../utils/context-utils.ts";

export async function deleteContext() {
  let name: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      n: "name",
      h: "help",
    },
  });
  if (args.help) {
    console.log("\x1b[33mArcGIS CLI - Context - Delete  \x1b[0m");
    console.log("Usage:");
    console.log("\t\x1b[32m$ arcgis-cli context delete\x1b[0m");
    console.log(
      "\tThe CLI tool will prompt you for the parameters it needs.\n",
    );
    console.log("Flags:");
    console.log("\t\x1b[34m--name, -n\x1b[0m");
    console.log(
      '\t\t Name of the context. If the name contains spaces, wrap it in quotes "".',
    );

    Deno.exit(0);
  }
  if (args.name) {
    name = args.name;
  } else {
    while (!name) {
      name = prompt("Context name:");
    }
  }
  const contextFile = await readContextFile();
  for (const context of contextFile.contexts) {
    if (context.name === name) {
      contextFile.contexts.splice(
        contextFile.contexts.indexOf(context),
        1,
      );
    }
  }

  writeContextFile(contextFile);
}
