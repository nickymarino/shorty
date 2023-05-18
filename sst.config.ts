import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { Database } from "./stacks/Database";
import { Site } from "./stacks/Site";

export default {
  config(_input) {
    return {
      name: "cow-link",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
    app.stack(Database);
    app.stack(Site);
  },
} satisfies SSTConfig;
