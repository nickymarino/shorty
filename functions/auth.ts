import { findOrCreateByGithubId } from "@/functions/core/entities/user";
import { AuthHandler, GithubAdapter, Session } from "sst/node/auth";
import { Config } from "sst/node/config";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}

async function findGithubUserId(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = await response.json();
  return body.id;
}

async function userFromGithubToken(token: string) {
  const userGitHubId = await findGithubUserId(token);
  console.log({ userGitHubId });
  const user = await findOrCreateByGithubId(userGitHubId);
  console.log({ user });
  return user;
}

export const handler = AuthHandler({
  providers: {
    /*
      Start of flow: /auth/github/authorize
      eg: https://j7tgyxxjg4.execute-api.us-east-1.amazonaws.com/auth/github/authorize

      Callback: /auth/github/callback

      >>> requests.get('https://api.github.com/user', headers={"Authorization": "Bearer ghu_XXXXXXX"})
    */
    github: GithubAdapter({
      clientID: Config.GITHUB_CLIENT_ID,
      clientSecret: Config.GITHUB_CLIENT_SECRET,
      scope: "", // empty = read only, public values
      onSuccess: async (tokenset) => {
        const accessToken = tokenset.access_token;
        if (!accessToken) {
          throw new Error("No access token");
        }
        const user = await userFromGithubToken(accessToken);

        return Session.parameter({
          redirect: "https://example.com",
          type: "user",
          properties: {
            userID: user.userId,
          },
        });
      },
    }),
  },
});
