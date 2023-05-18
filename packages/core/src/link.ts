import { Entity } from "electrodb";
import { Dynamo } from "./dynamo";
import { ulid } from "ulid";

export * as Link from "./link";

export const LinkEntity = new Entity(
  {
    model: {
      entity: "links",
      version: "1",
      service: "cowlinks",
    },
    attributes: {
      uid: {
        type: "string",
        required: true,
      },
      shortPath: {
        type: "string",
        required: true,
      },
      url: {
        type: "string",
        required: true,
      },
      // TODO: Add createdAt, updatedAt, expiresAt?
    },
    indexes: {
      byUid: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["uid"],
        },
      },
      byShortPath: {
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: "gsi1pk",
          composite: ["shortPath"],
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

export async function create(shortPath: string, url: string) {
  const result = await LinkEntity.create({
    uid: ulid(),
    shortPath,
    url,
  }).go();

  return result.data;
}

export async function get(uid: string) {
  const result = await LinkEntity.get({ uid }).go();
  return result.data;
}

export async function list() {
  const result = await LinkEntity.query.byUid({}).go();
}