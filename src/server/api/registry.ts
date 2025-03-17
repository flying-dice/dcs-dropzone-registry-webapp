import "zod-openapi/extend";
import { z } from "zod";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../constants.ts";
import { jsonContent } from "../utils/jsonContent.ts";
import { validator } from "hono-openapi/zod";
import { getModById, getMods, Mod } from "../dao/user-mods.ts";
import { HTTPException } from "hono/http-exception";

export const releaseDataSchema = z.object({
  releasepage: z.coerce.string().url().describe(
    "The release page of the release",
  ),
  name: z.coerce.string().describe("The name of the release"),
  version: z.coerce.string().describe("The version of the release"),
  date: z.coerce.date().describe("The date of the release"),
  exePath: z.coerce.string().describe("Executable file specifically Tools")
    .optional(),
  assets: z
    .array(
      z.object({
        remoteSource: z.coerce.string().describe(
          "The URL of the file to download",
        ),
        links: z.array(
          z.object({
            source: z.coerce
              .string()
              .describe(
                "The name of the file # separates download path and internal zip path",
              ),
            target: z.coerce
              .string()
              .describe(
                "The name of the installation location relative to install path",
              )
              .refine((it) => !it.includes("\\"), {
                message:
                  "The target path cannot contain backslashes, use unix style paths i.e. '/'",
              }),
            runonstart: z.coerce
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

export const releaseDtoSchema = releaseDataSchema.extend({
  content: z.string(),
});

export const indexDataSchema = z.object({
  homepage: z.coerce.string().url().describe("The homepage of the mod"),
  name: z.coerce.string().describe("The name of the mod"),
  description: z.coerce
    .string()
    .describe("A short description of the mod to be displayed in the mod tile"),
  authors: z
    .array(
      z.union([
        z.coerce.string(),
        z.object({
          name: z.coerce.string(),
          avatar: z.coerce.string(),
          url: z.coerce.string(),
        }),
      ]),
    )
    .describe(
      "The authors of the mod either as a string or an object with name, avatar and url",
    ),
  tags: z
    .array(z.coerce.string())
    .describe(
      "The tags of the mod, these are used to filter mods in the mod browser",
    ),
  category: z.coerce
    .string()
    .describe(
      "The category of the mod, this is used to group mods in the mod browser",
    ),
  license: z.coerce.string().describe("The license of the mod"),
  latest: z.coerce
    .string()
    .describe("The latest version of the mod to be pushed to the subscribers"),
  dependencies: z.array(
    z.coerce.string().regex(
      /^[a-z0-9-]+$/,
      "The Mod dependency id must be a url safe path specifically kebab case formatted",
    ),
  ).optional().describe("The dependencies of the mod"),
  versions: z.array(releaseDataSchema).describe("The versions of the mod"),
});

export const indexDtoSchema = indexDataSchema.extend({
  id: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "The Mod id must be a url safe path specifically kebab case formatted",
    ),
  imageUrl: z.string(),
  content: z.string(),
  authors: z.array(
    z.object({
      name: z.string(),
      avatar: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
  latest: z.coerce.string(),
});

export const registryIndexItemDtoSchema = indexDtoSchema.omit({
  homepage: true,
  license: true,
  content: true,
  versions: true,
});

const router = new Hono();

router.get(
  "/index.json",
  describeRoute({
    summary: "Get Registry Index",
    operationId: "getRegistryIndex",
    tags: ["Registry"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        z.array(registryIndexItemDtoSchema),
        "The index of the registry",
      ),
    },
  }),
  async (c) => {
    const mods = await getMods();

    const registryMods = mods.filter((it) => it.published).map((mod: Mod) => ({
      ...mod,
      authors: mod.authors.map((author: string) => ({
        name: author,
      })),
    }));

    return c.json(z.array(registryIndexItemDtoSchema).parse(registryMods));
  },
);

const params = z.object({ id: indexDtoSchema.shape.id });

router.get(
  "/:id/index.json",
  describeRoute({
    summary: "Get Registry Entry",
    operationId: "getRegistryEntry",
    tags: ["Registry"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        indexDtoSchema,
        "The entry of the registry",
      ),
    },
  }),
  validator("param", params),
  async (c) => {
    const mod = await getModById(c.req.valid("param").id);

    if (!mod) {
      throw new HTTPException(HTTP_STATUS_NOT_FOUND);
    }

    const registryMod = {
      ...mod,
      authors: mod.authors.map((author: string) => ({
        name: author,
      })),
    };

    return c.json(indexDtoSchema.parse(registryMod));
  },
);

export default router;
