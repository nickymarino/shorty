import { AuthHandler, LinkAdapter, Session } from "sst/node/auth";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}

export const handler = AuthHandler({
  providers: {
    // Frontend
    // location.href =
    //  "https://api.example.com/auth/link/authorize?email=user@example.com";
    link: LinkAdapter({
      onLink: async (link, claims) => {
        console.log({ link, claims });
        return {
          statusCode: 200,
          body: JSON.stringify({ link }),
        };
      },
      onSuccess: async (claims) => {
        console.log({ claims });
        // https://example.com/?token=XXXXXX
        return Session.parameter({
          redirect: "https://example.com",
          type: "user",
          properties: {
            userID: "1234",
          },
        });
      },
      onError: async () => {
        console.log("ERROR!");
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "there was an error" }),
        };
      },
    }),
  },
});
