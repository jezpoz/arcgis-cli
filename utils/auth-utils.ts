import { ensureFile } from "@std/fs";

export interface IArcGISCLITokenFileContent {
  token: string;
  expires: number;
  ssl: boolean;
}

const tokenFilePath = Deno.cwd() + "/arcgis-token.json";

export async function readTokenFile(): Promise<IArcGISCLITokenFileContent> {
  await ensureFile(tokenFilePath);

  const decoder = new TextDecoder("utf-8");
  const buffer = await Deno.readFile(tokenFilePath);
  const fileContent = decoder.decode(buffer);
  return JSON.parse(fileContent) as IArcGISCLITokenFileContent;
}

export async function writeTokenFile(
  content: IArcGISCLITokenFileContent,
): Promise<void> {
  const toFileBuffer = new TextEncoder().encode(
    JSON.stringify(content, null, 2),
  );

  await Deno.writeFile(tokenFilePath, toFileBuffer);
}
