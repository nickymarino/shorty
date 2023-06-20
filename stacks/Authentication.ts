import { Auth, StackContext, use } from "sst/constructs";
import { API } from "./API";

export function Authentication({ stack }: StackContext) {
  const { api } = use(API);

  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "functions/auth.handler",
    },
  });

  auth.attach(stack, {
    api,
    prefix: "/auth",
  });
}
