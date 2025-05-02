import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import health from "./api/health.ts";
import auth from "./api/auth.ts";
import { config } from "./config.ts";
import userMods from "./api/user-mods.ts";
import sudoMods from "./api/sudo-mods.ts";
import registry from "./api/registry.ts";

export const app = new Hono();
app.use(logger());
app.use("/*", cors());

app.route("/api/health", health);
app.route("/api/user-mods", userMods);
app.route("/api/sudo-mods", sudoMods);
app.route("/auth", auth);
app.route("/api/registry", registry);

app.get(
  "/v3/api-docs",
  openAPISpecs(app, {
    excludeStaticFile: false,
    documentation: {
      info: {
        title: "DCS Dropzone Registry",
        description: "DCS Dropzone Registry API",
        version: "1.0.0",
      },
      tags: [{
        name: "Auth",
        description:
          "Endpoints for managing authentication and authorization of users, such as login, logout and callback. This includes a method for retrieving the user's profile",
      }, {
        name: "Health",
        description:
          "Endpoints for checking the health of the service, such as readiness and liveness probes",
      }, {
        name: "User Mods",
        description:
          "Endpoints for managing user mods, such as getting, creating, updating and deleting user mods",
      }, {
        name: "Sudo Mods",
        description:
          "Endpoints for managing sudo mods, such as getting, creating, updating and deleting sudo mods",
      }, {
        name: "Registry",
        description:
          "Endpoints for managing the registry, such as getting, creating, updating and deleting registry entries",
      }],
      components: {
        securitySchemes: {
          cookieAuth: {
            name: config.sessionCookieName,
            type: "apiKey",
            in: "cookie",
          },
        },
      },
    },
  }),
);

app.get(
  "/api",
  apiReference({ url: "/v3/api-docs" }),
);

app.get("/*", serveStatic({ root: "dist" }));
