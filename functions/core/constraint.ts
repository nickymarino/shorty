import { Dynamo } from "@/functions/core/dynamo";
import { Entity } from "electrodb";
export * as Constraint from "./constraint";

export const ConstraintEntity = new Entity(
  {
    model: {
      entity: "constraints",
      version: "1",
      service: "shorty",
    },
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      value: {
        type: "string",
        required: true,
      },
      entity: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      byValue: {
        pk: {
          field: "pk",
          composite: ["value"],
        },
        sk: {
          field: "sk",
          composite: ["name", "entity"],
        },
      },
      byName: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["name", "entity"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["value"],
        },
      },
    },
  },
  Dynamo.Configuration
);
