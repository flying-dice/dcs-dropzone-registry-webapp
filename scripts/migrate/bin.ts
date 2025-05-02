// Migrates from the legacy registry to the new registry by downloading all the mods and uploading them to the new registry using the sudo mods endpoint.

import { getRegistryEntry, getRegistryIndex } from "./legacy-client.ts";
import { type Mod } from "../../src/client/_autogen/api.ts";
import { writeFileSync } from "node:fs";

const { data } = await getRegistryIndex();

const modIds = data.map((mod) => mod.id);

const mods: Mod[] = [];

for (const modId of modIds) {
  const { data } = await getRegistryEntry(modId);

  mods.push({
    ...data,
    authors: data.authors.map((author) => author.name),
    imageUrl: "https://dcs-mod-manager-registry.pages.dev/" + data.imageUrl,
    published: true,
    maintainers: ["16135506"],
    dependencies: [],
  } as Mod);
}

for (const mod of mods) {
  writeFileSync(`${mod.id}.json`, JSON.stringify(mod, null, 2));
}
