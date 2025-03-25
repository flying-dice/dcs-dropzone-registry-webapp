import "zod-openapi/extend";
import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { describeRoute } from "hono-openapi";
import { validator } from "hono-openapi/zod";
import { cookieAuth } from "../middleware/cookieAuth.ts";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../constants.ts";
import { jsonContent } from "../utils/jsonContent.ts";
import {
  deleteMod,
  getModById,
  getMods,
  modSchema,
  setMod,
} from "../dao/user-mods.ts";
import { sudoUser } from "../middleware/sudoUser.ts";
import { zodToJsonSchema } from "zod-to-json-schema";
import { purgeCloudflareCache } from "../utils/purgeCloudflareCache.ts";
import { config } from "../config.ts";

const mod = modSchema.openapi({
  title: "Mod",
  description: "A mod",
  ref: "Mod",
});

const router = new Hono();

router.get(
  "/schema",
  describeRoute({
    operationId: "getSudoModSchema",
    summary: "Get Sudo Mod Schema",
    description: "Returns the schema for a mod.",
    tags: ["Sudo Mods"],
    responses: {
      [HTTP_STATUS_OK]: {
        description: "The jsonschema7 schema for a mod",
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
    },
  }),
  (c) => {
    return c.json(zodToJsonSchema(mod, { target: "jsonSchema7" }));
  },
);

router.get(
  "/",
  describeRoute({
    operationId: "getSudoMods",
    summary: "Get All User Mods.",
    description: "Returns a list of all mods.",
    tags: ["Sudo Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        z.array(mod),
        "A list of mods",
      ),
    },
  }),
  cookieAuth(),
  sudoUser(),
  async (c) => {
    const mods = await getMods();

    return c.json(z.array(mod).parse(mods));
  },
);

router.get(
  "/:id",
  describeRoute({
    operationId: "getSudoModById",
    summary: "Get User Mod By ID.",
    description: "Returns the mod with the specified ID.",
    tags: ["Sudo Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        mod,
        "The mod",
      ),
      [HTTP_STATUS_NOT_FOUND]: {
        description: "The mod with the specified ID does not exist",
      },
    },
  }),
  cookieAuth(),
  sudoUser(),
  validator(
    "param",
    z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    const mod = await getModById(id);

    if (!mod) {
      throw new HTTPException(HTTP_STATUS_NOT_FOUND);
    }

    return c.json(mod);
  },
);

router.put(
  "/:id",
  describeRoute({
    operationId: "setSudoModbyId",
    summary: "Update User Mod",
    description: "Updates the mod with the specified ID.",
    tags: ["Sudo Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        mod,
        "The updated mod",
      ),
      [HTTP_STATUS_NOT_FOUND]: {
        description: "The mod with the specified ID does not exist",
      },
    },
  }),
  cookieAuth(),
  sudoUser(),
  validator(
    "param",
    z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  ),
  validator("json", mod),
  async (c) => {
    const mod = c.req.valid("json");

    const result = await setMod(mod);
    if (config.features.enableCloudflarePurge) {
      await purgeCloudflareCache(mod.id);
    }

    return c.json(result);
  },
);

router.delete(
  "/:id",
  describeRoute({
    operationId: "deleteSudoModById",
    summary: "Delete User Mod By ID.",
    description: "Deletes the mod with the specified ID.",
    tags: ["Sudo Mods"],
    responses: {
      [HTTP_STATUS_OK]: {
        description: "The mod was deleted successfully",
      },
      [HTTP_STATUS_NOT_FOUND]: {
        description: "The mod with the specified ID does not exist",
      },
    },
  }),
  cookieAuth(),
  sudoUser(),
  validator(
    "param",
    z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    const mod = await getModById(id);

    if (!mod) {
      throw new HTTPException(HTTP_STATUS_NOT_FOUND);
    }

    await deleteMod(mod.id);

    return c.text("");
  },
);

export default router;
