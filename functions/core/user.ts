import { ConstraintEntity } from "@/functions/core/constraint";
import { Dynamo } from "@/functions/core/dynamo";
import { Entity, Service } from "electrodb";
import { ulid } from "ulid";

export * as User from "./user";

/* RFC 5322 Format
   See: https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/
*/
const validEmailRegex = new RegExp(
  "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
);

export class EmailNotUniqueError extends Error {}

const validateEmail = (email: string) => {
  const isValid = validEmailRegex.test(email);
  if (!isValid) {
    return "Invalid email address";
  }
};

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
        validate: validateEmail,
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
  // Enforce unique email constraint on users
  const userConstraintService = new Service(
    {
      user: UserEntity,
      constraint: ConstraintEntity,
    },
    Dynamo.Configuration
  );

  // From: https://electrodb.dev/en/mutations/transact-write/#example---unique-constraint
  const result = await userConstraintService.transaction
    .write(({ user, constraint }) => [
      user
        .create({
          uid: ulid(),
          email,
        })
        .commit(),
      constraint
        .create({
          name: "email",
          value: email,
          entity: user.schema.model.entity,
        })
        .commit(),
    ])
    .go();

  if (result.canceled) {
    throw new EmailNotUniqueError(`Could not create user: ${result.data}`);
  }

  // Transaction writes can't return the values, so we have to query for them by email
  const user = await UserEntity.query.byEmail({ email }).go();
  return user.data;
}
