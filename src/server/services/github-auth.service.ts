import { OAuthApp, Octokit } from "octokit";
import { SignJWT } from "jose";
import { config } from "../config.ts";
import { AuthService, UserData } from "./auth.service.ts";

export class GithubAuthService implements AuthService {
  private readonly app: OAuthApp;

  private readonly encodedSecret: Uint8Array<ArrayBufferLike>;

  constructor() {
    this.encodedSecret = new TextEncoder().encode(config.jwtSecret);
    this.app = new OAuthApp({
      clientType: "oauth-app",
      clientId: config.ghClientId,
      clientSecret: config.ghClientSecret,
      redirectUrl: config.ghAuthorizationCallbackUrl,
      allowSignup: true,
    });
  }

  getWebFlowAuthorizationUrl() {
    return this.app.getWebFlowAuthorizationUrl({}).url;
  }

  async handleCallback(
    code: string,
    state: string,
  ): Promise<{ user: UserData; token: string }> {
    console.log({ code, state });
    const auth = await this.app.createToken({ code, state });
    console.log(auth);

    const kit = new Octokit({ auth: auth.authentication.token });
    const { data } = await kit.rest.users.getAuthenticated();

    const user: UserData = {
      userId: data.id.toString(),
      userLogin: data.login,
      userAvatarUrl: data.avatar_url,
      userProfileUrl: data.html_url,
      userName: data.name ?? undefined,
    };

    const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" })
      .sign(this.encodedSecret);

    return { user, token };
  }
}

export const githubAuthService = new GithubAuthService();
