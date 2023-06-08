import { Entity, CreateEntityItem } from "electrodb";
import { Dynamo } from "./dynamo";
import { ulid } from "ulid";
import { UpdateEntityItem } from "electrodb";

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
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["uid"],
        },
      },
      byShortPath: {
        index: "gsi1",
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

export async function getByShortPath(shortPath: string) {
  const result = await LinkEntity.query.byShortPath({ shortPath }).go();
  return result.data;
}

type PatchAttributes = UpdateEntityItem<typeof LinkEntity>;

export async function patch(uid: string, newAttributes: PatchAttributes) {
  const result = await LinkEntity.patch({ uid }).set(newAttributes).go({
    response: "all_new",
  });
  console.log({ result });
  return result.data;
}

export async function list() {
  const result = await LinkEntity.query.byUid({}).go();
  return result.data;
}
