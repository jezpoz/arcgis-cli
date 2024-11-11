import { parseArgs } from "@std/cli";

export function createFeatureLayer() {
  let name: string | null = null;
  const args = parseArgs(Deno.args, {
    alias: {
      name: "n",
    },
  });
  if (args.name) {
    name = args.name;
  } else {
    while (!name) {
      name = prompt("Feature layer name:");
    }
  }
  console.log("Creating a feature layer with the name:", name);
}
