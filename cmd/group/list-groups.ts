import { readContextFile } from "../../utils/context-utils.ts";
import { readTokenFile } from "../../utils/auth-utils.ts";

interface IGroup {
  id: string;
  title: string;
  isInvitationOnly: boolean;
  owner: string;
  description: string;
  snippet: string;
  tags: string[];
  typeKeywords: string[];
  phone: string[];
  sortField: string;
  sortOrder: string;
  isViewOnly: boolean;
  featuredItemsId: string[];
  thumbnail: string;
  created: number;
  modified: number;
  access: string;
  capabilities: string[];
  isFav: boolean;
  isReadOnly: boolean;
  protected: boolean;
  autoJoin: boolean;
  notificationsEnabled: boolean;
  provider: string;
  providerGroupName: string;
  leavingDisallowed: boolean;
  hiddenMembers: boolean;
  membershipAccess: string;
  displaySettings: {
    itemTypes: string;
  };
  orgId: string;
  properties: {
    [x: string]: any;
  }
}

interface IGroupSearchResponse {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IGroup[];
}


export async function listGroups() {
  const context = await readContextFile();
  const token = await readTokenFile();

  const activeContext = context.contexts.find(c => c.name === context.activeContext);
  if (!activeContext) {
    Deno.exit(3);
  }
  const groupSearchEndpoint = new URL(
    "/portal/sharing/rest/community/groups",
    activeContext.portalUrl,
  );

  groupSearchEndpoint.searchParams.append("token", token.token);
  groupSearchEndpoint.searchParams.append("searchUserAccess", "groupMember");
  groupSearchEndpoint.searchParams.append("f", "json");

  const groupSearchResponse = await fetch(groupSearchEndpoint);
  if (groupSearchResponse.status === 200) {
    const groupSearchJson = await groupSearchResponse.json() as IGroupSearchResponse;
    console.log("Groups")
    for (const group of groupSearchJson.results) {
      console.log(`\t- Title: ${group.title}`);
      console.log(`\t  ID: ${group.id}`);
    }
  }
}