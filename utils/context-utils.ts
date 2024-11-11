import { ensureFile } from "@std/fs";

export interface IArcGISCLIContextFileContent {
  activeContext: string | null;
  contexts: {
    name: string;
    portalUrl: string;
  }[];
}

const contextFilePath = Deno.cwd() + "/arcgis-context.json";

export async function readContextFile(): Promise<IArcGISCLIContextFileContent> {
  await ensureFile(contextFilePath);

  const decoder = new TextDecoder("utf-8");
  const buffer = await Deno.readFile(contextFilePath);
  const fileContent = decoder.decode(buffer);
  return JSON.parse(fileContent) as IArcGISCLIContextFileContent;
}

export async function writeContextFile(
  content: IArcGISCLIContextFileContent,
): Promise<void> {
  const toFileBuffer = new TextEncoder().encode(
    JSON.stringify(content, null, 2),
  );

  await Deno.writeFile(contextFilePath, toFileBuffer);
}
