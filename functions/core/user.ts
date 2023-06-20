import { Dynamo } from "@/functions/core/dynamo";
import { Entity } from "electrodb";
import { ulid } from "ulid";

export * as User from "./user";

export const UserEntity = new Entity(
  {
    model: {
      entity: "users",
      version: "1",
      service: "shorty",
    },
    attributes: {
      uid: {
        type: "string",
        required: true,
      },
      email: {
        type: "string",
        required: true,
      },
      createdAt: {
        type: "number",
        readOnly: true,
        set: () => Date.now(),
      },
      updatedAt: {
        type: "number",
        readOnly: true,
        watch: "*",
        set: () => Date.now(),
      },
    },
    indexes: {
      byUid: {
        pk: {
          field: "pk",
          composite: ["uid"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byEmail: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["email"],
        },
        sk: {
          field: "gsi1sk",
          composite: [],
        },
      },
    },
  },
  Dynamo.Configuration
);

export async function create(email: string) {
  const result = await UserEntity.create({
    uid: ulid(),
    email,
  }).go();

  return result.data;
}
