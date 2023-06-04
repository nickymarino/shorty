import { NextjsSite, StackContext, use } from "sst/constructs";
import { API } from "./API";

export function Site({ stack }: StackContext) {
  const { api } = use(API);

  const site = new NextjsSite(stack, "site", {
    bind: [api],
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
