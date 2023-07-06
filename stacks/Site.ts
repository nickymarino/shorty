import { NextjsSite, StackContext, use } from "sst/constructs";
import { API } from "./API";

export function Site({ stack }: StackContext) {
  const { api } = use(API);

  const site = new NextjsSite(stack, "site", {
    bind: [api],
    environment: {
      NEXT_PUBLIC_API_BASE_URL: api.url,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });

  return { site };
}
