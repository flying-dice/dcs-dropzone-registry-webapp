import z from "zod";

const configSchema = z.object({
  jwtSecret: z.string(),
  sessionCookieName: z.string(),
  ghClientId: z.string(),
  ghClientSecret: z.string(),
  ghAuthorizationCallbackUrl: z.string().url(),
  sudoUsers: z.array(z.string()),
  ghHomepageUrl: z.string().url(),
});

export const config = configSchema.parse({
  sessionCookieName: "JSESSIONID",
  jwtSecret: Deno.env.get("JWT_SECRET"),
  ghClientId: Deno.env.get("GH_CLIENT_ID"),
  ghClientSecret: Deno.env.get("GH_CLIENT_SECRET"),
  ghAuthorizationCallbackUrl: Deno.env.get("GH_AUTHORIZATION_CALLBACK_URL"),
  ghHomepageUrl: Deno.env.get("GH_HOMEPAGE_URL"),
  sudoUsers: Deno.env.get("SUDO_USERS")?.split(",") || [],
});
