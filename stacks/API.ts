import { StackContext, Api, use, FunctionNameProps } from "sst/constructs";
import { Database } from "./Database";

function nameFor(shortName: string) {
  const nameGenerator = (props: FunctionNameProps): string => {
    return `${props.stack.stackName}-${shortName}`;
  };
  return nameGenerator;
}

export function API({ stack }: StackContext) {
  const { table } = use(Database);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /link/{id}": {
        function: {
          functionName: nameFor("LinkGet"),
          handler: "packages/functions/src/link/get.handler",
        },
      },
      "POST /link": {
        function: {
          functionName: nameFor("LinkCreate"),
          handler: "packages/functions/src/link/create.handler",
        },
      },
      "GET /links": {
        function: {
          functionName: nameFor("LinkList"),
          handler: "packages/functions/src/link/list.handler",
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
