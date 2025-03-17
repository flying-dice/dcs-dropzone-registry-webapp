import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { config } from "../config.ts";
import { HTTP_STATUS_UNAUTHORIZED } from "../constants.ts";
import { jwtVerify } from "jose";
import { UserData, userDataSchema } from "../services/auth.service.ts";

export const sudoUser = () =>
  createMiddleware(async (c, next) => {
    const token = getCookie(c, config.sessionCookieName);

    if (!token) {
      console.warn("No token found in cookie");
      throw new HTTPException(HTTP_STATUS_UNAUTHORIZED);
    }

    const userToken = await jwtVerify<UserData>(
      token,
      new TextEncoder().encode(config.jwtSecret),
    );

    const { userId } = userDataSchema.parse(userToken.payload);

    if (config.sudoUsers.includes(userId)) {
      await next();
    } else {
      console.warn("User is not a sudo user");
      throw new HTTPException(HTTP_STATUS_UNAUTHORIZED);
    }
  });
