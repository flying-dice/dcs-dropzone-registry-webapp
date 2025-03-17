import "zod-openapi/extend";
import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { describeRoute } from "hono-openapi";
import { validator } from "hono-openapi/zod";
import { cookieAuth } from "../middleware/cookieAuth.ts";
import {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} from "../constants.ts";
import { jsonContent } from "../utils/jsonContent.ts";
import {
  getModById,
  getModsByMaintainer,
  modSchema,
  setMod,
} from "../dao/user-mods.ts";

export const mod = modSchema.openapi({
  title: "Mod",
  description: "A mod",
  ref: "Mod",
});

export const modSummary = modSchema.omit({
  content: true,
  versions: true,
}).openapi({
  title: "Mod Summary",
  description: "A summary of a mod",
  ref: "ModSummary",
});

const router = new Hono();

router.get(
  "/",
  describeRoute({
    operationId: "getUserMods",
    summary: "Get All User Mods",
    description:
      "Returns a list of all mods maintained by the authenticated user.",
    tags: ["User Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        z.array(modSummary),
        "A list of mods maintained by the authenticated user",
      ),
    },
  }),
  cookieAuth(),
  async (c) => {
    const user = c.var.getUser();

    const mods = await getModsByMaintainer(user.userId);

    return c.json(z.array(modSummary).parse(mods));
  },
);

router.get(
  "/:id",
  describeRoute({
    operationId: "getUserModById",
    summary: "Get User Mod By ID",
    description:
      "Returns the mod with the specified ID if it is maintained by the authenticated user. If the mod exists, but is not maintained by the authenticated user, a 403 Forbidden error is returned.",
    tags: ["User Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        mod,
        "The mod maintained by the authenticated user",
      ),
      [HTTP_STATUS_NOT_FOUND]: {
        description: "The mod with the specified ID does not exist",
      },
      [HTTP_STATUS_FORBIDDEN]: {
        description:
          "The mod with the specified ID exists, but is not maintained by the authenticated user",
      },
    },
  }),
  cookieAuth(),
  validator(
    "param",
    z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  ),
  async (c) => {
    const user = c.var.getUser();
    const { id } = c.req.valid("param");

    const mod = await getModById(id);

    if (!mod) {
      throw new HTTPException(HTTP_STATUS_NOT_FOUND);
    }

    if (!mod.maintainers.includes(user.userId)) {
      throw new HTTPException(HTTP_STATUS_FORBIDDEN);
    }

    return c.json(mod);
  },
);

router.put(
  "/:id",
  describeRoute({
    operationId: "updateUserMod",
    summary: "Update User Mod",
    description:
      "Updates the mod with the specified ID if it is maintained by the authenticated user. If the mod exists, but is not maintained by the authenticated user, a 403 Forbidden error is returned.",
    tags: ["User Mods"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        mod,
        "The updated mod maintained by the authenticated user",
      ),
      [HTTP_STATUS_NOT_FOUND]: {
        description: "The mod with the specified ID does not exist",
      },
      [HTTP_STATUS_FORBIDDEN]: {
        description:
          "The mod with the specified ID exists, but is not maintained by the authenticated user",
      },
    },
  }),
  cookieAuth(),
  validator(
    "param",
    z.object({
      id: z.string().openapi({ param: { name: "id", in: "path" } }),
    }),
  ),
  validator("json", mod),
  async (c) => {
    const user = c.var.getUser();
    const { id } = c.req.valid("param");
    const mod = c.req.valid("json");

    const existing = await getModById(id);

    if (existing && !existing.maintainers.includes(user.userId)) {
      throw new HTTPException(HTTP_STATUS_FORBIDDEN);
    }

    const result = await setMod(mod);

    return c.json(result);
  },
);

export default router;
