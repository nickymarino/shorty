import { AuthHandler, GithubAdapter, Session } from "sst/node/auth";
import { Config } from "sst/node/config";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
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
      onSuccess: async (tokenset, client) => {
        console.log({ tokenset, client });

        const accessToken = tokenset.access_token;
        const response = await fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const body = await response.json();

        const userGitHubId = body.id;
        // TODO: from here, find our user ID based on github ID, and
        //       return a Session.parameter with our user ID

        console.log({ response });
        console.log({ body });
        console.log({ userGitHubId });

        return Session.parameter({
          redirect: "https://example.com",
          type: "user",
          properties: {
            userID: "1234",
          },
        });
      },
    }),
  },
});
