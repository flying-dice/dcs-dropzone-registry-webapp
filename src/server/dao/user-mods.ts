import { z } from "zod";
import { store } from "./store.ts";

export const releaseSchema = z.object({
  releasepage: z.string().url().describe(
    "The release page of the release",
  ),
  name: z.string().describe("The name of the release"),
  version: z.string().describe("The version of the release"),
  date: z.coerce.date().describe("The date of the release"),
  exePath: z.string().describe("Executable file specifically Tools")
    .optional(),
  assets: z
    .array(
      z.object({
        remoteSource: z.string().describe(
          "The URL of the file to download",
        ),
        links: z.array(
          z.object({
            source: z.string()
              .describe(
                "The name of the file # separates download path and internal zip path",
              ),
            target: z
              .string()
              .describe(
                "The name of the installation location relative to install path",
              )
              .refine((it) => !it.includes("\\"), {
                message:
                  "The target path cannot contain backslashes, use unix style paths i.e. '/'",
              }),
            runonstart: z
              .boolean()
              .optional()
              .describe(
                "Run on simulation (mission) start, note that this will execute the script before the mission environment is sanitized",
              ),
          }),
        ),
      }),
    )
    .describe("The array of files to install"),
});

export const modSchema = z.object({
  id: z.string().regex(
    /^[a-z0-9-]+$/,
    "The Mod id must be a url safe path specifically kebab case formatted",
  ),
  homepage: z.string().url().describe("The homepage of the mod"),
  name: z.string().describe("The name of the mod"),
  description: z
    .string()
    .describe("A short description of the mod to be displayed in the mod tile"),
  authors: z
    .array(z.string()).default([])
    .describe(
      "The authors of the mod as a list of strings",
    ),
  tags: z
    .array(z.string()).default([])
    .describe(
      "The tags of the mod, these are used to filter mods in the mod browser",
    ),
  category: z
    .string().default("Uncategorized")
    .describe(
      "The category of the mod, this is used to group mods in the mod browser",
    ),
  license: z.string().default("MIT License").describe("The license of the mod"),
  latest: z
    .string().optional()
    .describe("The latest version of the mod to be pushed to the subscribers"),
  dependencies: z.array(
    z.string().regex(
      /^[a-z0-9-]+$/,
      "The Mod dependency id must be a url safe path specifically kebab case formatted",
    ),
  ).default([]).describe("The dependencies of the mod"),
  versions: z.array(releaseSchema).default([]).describe(
    "The versions of the mod",
  ),
  imageUrl: z.string().optional().describe(
    "The URL of the image to display in the mod tile",
  ),
  content: z.string().default(
    "QWRkIGEgZ29vZCByZWFkbWUgc28gdXNlcnMgY2FuIHVuZGVyc3RhbmQgeW91ciBtb2QuLi4=",
  ).describe(
    "The content of the mod",
  ),
  published: z.boolean().default(false),
  maintainers: z.array(z.string()).min(1).describe(
    "The maintainers of the mod",
  ),
});

export const modSummarySchema = modSchema.omit({
  content: true,
  versions: true,
});

export const createModSchema = modSchema.pick({
  id: true,
  homepage: true,
  name: true,
  description: true,
  authors: true,
  maintainers: true,
});

export type Mod = z.infer<typeof modSchema>;
export type Release = z.infer<typeof releaseSchema>;
export type ModSummary = z.infer<typeof modSummarySchema>;

export async function getModById(id: string): Promise<Mod | undefined> {
  const mod = await store.get(["mods", id]);

  if (!mod.value) return;

  console.log("mod", mod.value);

  return modSchema.parse(mod.value);
}

export async function getMods(): Promise<Mod[]> {
  const mods = store.list({ prefix: ["mods"] });

  const modList: Mod[] = [];

  for await (const mod of mods) {
    if (!mod.value) continue;
    const result = modSchema.safeParse(mod.value);

    if (result.success) {
      modList.push(result.data);
    } else {
      console.warn("Invalid mod", result);
    }
  }

  return modList;
}

export async function getModsByMaintainer(maintainer: string): Promise<Mod[]> {
  const mods = store.list({ prefix: ["mods"] });

  const modList: Mod[] = [];

  for await (const mod of mods) {
    if (!mod.value) continue;
    const result = modSchema.safeParse(mod.value);

    if (result.success && result.data.maintainers.includes(maintainer)) {
      modList.push(result.data);
    }
  }

  return modList;
}

export async function setMod(mod: Mod): Promise<Mod> {
  const result = modSchema.parse(mod);
  await store.set(["mods", result.id], result);
  return result;
}

export async function deleteMod(id: string): Promise<void> {
  await store.delete(["mods", id]);
}
