import { Constraint } from "@/functions/core/entities/constraint";
import { Dynamo } from "@/functions/core/dynamo";
import { CreateEntityItem, Entity, Service } from "electrodb";
import { ulid } from "ulid";
import { serviceName } from "@/functions/core/service";

export class GithubIdNotUniqueError extends Error {}

export const User = new Entity(
  {
    model: {
      entity: "user",
      version: "1",
      service: serviceName,
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
      },
      githubId: {
        type: "number",
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
      byId: {
        pk: {
          field: "pk",
          composite: ["userId"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byGithubId: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["githubId"],
        },
        sk: {
          field: "gsi1sk",
          composite: [],
        },
      },
      owns: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["userId"],
        },
      },
    },
  },
  Dynamo.Configuration
);

type CreateProperties = Omit<CreateEntityItem<typeof User>, "userId">;

export async function create(props: CreateProperties) {
  // Enforce unique email constraint on users
  const userConstraintService = new Service(
    {
      User,
      Constraint,
    },
    Dynamo.Configuration
  );

  // From: https://electrodb.dev/en/mutations/transact-write/#example---unique-constraint
  const result = await userConstraintService.transaction
    .write(({ User, Constraint }) => [
      User.create({
        userId: ulid(),
        githubId: props.githubId,
      }).commit(),
      Constraint.create({
        name: "user-githubId",
        value: props.githubId.toString(),
        entity: User.schema.model.entity,
      }).commit(),
    ])
    .go();

  if (result.canceled) {
    throw new GithubIdNotUniqueError(`Could not create user: ${result.data}`);
  }

  // Transaction writes can't return the values, so we have to query for them by email
  const user = await User.query.byGithubId({ githubId: props.githubId }).go();
  return user.data[0];
}

export async function findOrCreateByGithubId(githubId: number) {
  const foundUser = await User.query.byGithubId({ githubId }).go();
  console.log({ foundUser });
  if (foundUser.data.length > 0) {
    console.log("Returning known user");
    return foundUser.data[0];
  }

  console.log("Creating new user");
  return create({ githubId });
}