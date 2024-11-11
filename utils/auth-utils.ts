import { ensureFile } from "@std/fs";

export interface IArcGISCLITokenFileContent {
  token: string;
  expires: number;
  ssl: boolean;
}

export interface IArcGISCLIProfileFileContent {
  username: string;
  udn: any;
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  created: number;
  modified: number;
  provider: string;
}

const tokenFilePath = "./arcgis-token.json";
const profileFilePath = "./arcgis-profile.json";

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

export async function readProfileFile(): Promise<IArcGISCLIProfileFileContent> {
  await ensureFile(profileFilePath);

  const decoder = new TextDecoder("utf-8");
  const buffer = await Deno.readFile(profileFilePath);
  const fileContent = decoder.decode(buffer);
  return JSON.parse(fileContent) as IArcGISCLIProfileFileContent;
}

export async function writeProfileFile(
  content: IArcGISCLIProfileFileContent,
): Promise<void> {
  const toFileBuffer = new TextEncoder().encode(
    JSON.stringify(content, null, 2),
  );

  await Deno.writeFile(profileFilePath, toFileBuffer);
}
