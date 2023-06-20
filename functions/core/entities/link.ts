import { Dynamo } from "@/functions/core/dynamo";
import { Entity, UpdateEntityItem } from "electrodb";
import { ulid } from "ulid";

export const Link = new Entity(
  {
    model: {
      entity: "link",
      version: "1",
      service: "shorty",
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
  const result = await Link.create({
    uid: ulid(),
    shortPath,
    url,
  }).go();

  return result.data;
}

export async function get(uid: string) {
  const result = await Link.get({ uid }).go();
  return result.data;
}

export async function getByShortPath(shortPath: string) {
  const result = await Link.query.byShortPath({ shortPath }).go();
  return result.data;
}

type PatchAttributes = UpdateEntityItem<typeof Link>;

export async function patch(uid: string, newAttributes: PatchAttributes) {
  const result = await Link.patch({ uid }).set(newAttributes).go({
    response: "all_new",
  });
  console.log({ result });
  return result.data;
}

export async function list() {
  const result = await Link.query.byUid({}).go();
  return result.data;
}
