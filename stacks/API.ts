import { StackContext, Api, use } from "sst/constructs";
import { Database } from "./Database";

export function API({ stack }: StackContext) {
  const { table } = use(Database);

  const api = new Api(stack, "api", {
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /link/{id}": {
        function: {
          functionName: `${stack.stackName}-LinkGet`,
          handler: "packages/functions/src/link/get.handler",
          bind: [table],
        },
      },
      "POST /link": {
        function: {
          functionName: `${stack.stackName}-LinkCreate`,
          handler: "packages/functions/src/link/create.handler",
          bind: [table],
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
