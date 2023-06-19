import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { Database } from "./stacks/Database";
import { Site } from "./stacks/Site";
import { Authentication } from "./stacks/Authentication";

export default {
  config(_input) {
    return {
      name: "shorty",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Database);
    app.stack(API);
    app.stack(Authentication);
    app.stack(Site);
  },
} satisfies SSTConfig;
