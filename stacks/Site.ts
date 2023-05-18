import { NextjsSite, StackContext } from "sst/constructs";

export function Site({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site");

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
