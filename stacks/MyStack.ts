import { StackContext, Api, use } from "sst/constructs";
import { Database } from "./Database";

export function API({ stack }: StackContext) {
  const { table } = use(Database);

  const api = new Api(stack, "api", {
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "POST /link": {
        function: {
          functionName: "LinkCreate",
          handler: "packages/functions/src/create.handler",
          bind: [table],
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
