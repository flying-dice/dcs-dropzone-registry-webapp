import "zod-openapi/extend";
import { z } from "zod";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { HTTP_STATUS_OK } from "../constants.ts";
import { jsonContent } from "../utils/jsonContent.ts";

export const healthResponse = z.object({
  status: z.literal("UP").describe("The health status of the server."),
})
  .openapi({
    description: "The health status of the server.",
    title: "Health",
    ref: "Health",
  });

const router = new Hono();

router.get(
  "/",
  describeRoute({
    summary: "Health Check",
    description: "Check the health of the server.",
    tags: ["Health"],
    responses: {
      [HTTP_STATUS_OK]: jsonContent(
        healthResponse,
        "The health status of the server.",
      ),
    },
  }),
  (c) => {
    return c.json(healthResponse.parse({ status: "UP" }));
  },
);

export default router;
