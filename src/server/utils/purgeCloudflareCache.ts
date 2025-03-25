import Cloudflare from "cloudflare";
import type { CachePurgeParams } from "cloudflare/resources/cache/cache.d.ts";
import { config } from "../config.ts";

const cfClient = new Cloudflare({ apiToken: config.cloudflareApiToken });

export async function purgeCloudflareCache(modId?: string) {
  console.log("Purging cache for mod", modId);
  const purgeParams: CachePurgeParams.CachePurgeSingleFile = {
    zone_id: config.cloudflareZoneId,
    files: [
      "https://dcs-dropzone.app/api/registry/index.json",
      `https://dcs-dropzone.app/api/registry/${modId}/index.json`,
    ],
  };
  await cfClient.cache.purge(purgeParams).then(
    () => console.log("Successfully purged cache for mod", modId),
  ).catch(console.error);
}
