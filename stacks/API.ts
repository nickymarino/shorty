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
          handler: "functions/redirect.handler",
        },
      },
      "POST /user": {
        function: {
          functionName: nameFor("UserCreate"),
          handler: "functions/user/create.handler",
        },
      },
      "GET /link/{id}": {
        function: {
          functionName: nameFor("LinkGet"),
          handler: "functions/link/get.handler",
        },
      },
      "POST /link": {
        function: {
          functionName: nameFor("LinkCreate"),
          handler: "functions/link/create.handler",
        },
      },
      "PATCH /link/{uid}": {
        function: {
          functionName: nameFor("LinkPatch"),
          handler: "functions/link/patch.handler",
        },
      },
      "GET /links": {
        function: {
          functionName: nameFor("LinkList"),
          handler: "functions/link/list.handler",
        },
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
