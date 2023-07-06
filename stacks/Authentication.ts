import { Auth, Config, StackContext, use } from "sst/constructs";
import { API } from "./API";

export function Authentication({ stack }: StackContext) {
  const { api } = use(API);

  // See how to set secret values via sst:
  // https://docs.sst.dev/config#should-i-use-configsecret-or-env-for-secrets
  const GITHUB_CLIENT_ID = new Config.Secret(stack, "GITHUB_CLIENT_ID");
  const GITHUB_CLIENT_SECRET = new Config.Secret(stack, "GITHUB_CLIENT_SECRET");

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "functions/auth.handler",
      bind: [GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET],
    },
  });

  auth.attach(stack, {
    api,
    prefix: "/auth",
  });
}
