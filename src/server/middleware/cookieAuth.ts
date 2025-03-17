import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { config } from "../config.ts";
import { HTTP_STATUS_UNAUTHORIZED } from "../constants.ts";
import { jwtVerify } from "jose";
import type { UserData } from "../services/auth.service.ts";
import { userDataSchema } from "../services/auth.service.ts";

type Env = {
  Variables: {
    getUser: () => UserData;
  };
};

export const cookieAuth = () =>
  createMiddleware<Env>(async (c, next) => {
    const token = getCookie(c, config.sessionCookieName);

    if (!token) {
      console.warn("No token found in cookie");
      throw new HTTPException(HTTP_STATUS_UNAUTHORIZED);
    }

    const userToken = await jwtVerify(
      token,
      new TextEncoder().encode(config.jwtSecret),
    );

    const user = userDataSchema.parse(userToken.payload);

    c.set("getUser", () => user);

    await next();
  });
