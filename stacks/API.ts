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
      "GET /s/{shortPath}": {
        function: {
          functionName: nameFor("Redirect"),
          handler: "packages/functions/src/redirect.handler",
        },
      },
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
      "PATCH /link/{uid}": {
        function: {
          functionName: nameFor("LinkPatch"),
          handler: "packages/functions/src/link/patch.handler",
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

  return { api };
}
