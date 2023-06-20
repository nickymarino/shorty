import { Constraint } from "@/functions/core/entities/constraint";
import { Dynamo } from "@/functions/core/dynamo";
import { Entity, Service } from "electrodb";
import { ulid } from "ulid";

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

export const User = new Entity(
  {
    model: {
      entity: "user",
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
      User,
      Constraint,
    },
    Dynamo.Configuration
  );

  // From: https://electrodb.dev/en/mutations/transact-write/#example---unique-constraint
  const result = await userConstraintService.transaction
    .write(({ User, Constraint }) => [
      User.create({
        uid: ulid(),
        email,
      }).commit(),
      Constraint.create({
        name: "email",
        value: email,
        entity: User.schema.model.entity,
      }).commit(),
    ])
    .go();

  if (result.canceled) {
    throw new EmailNotUniqueError(`Could not create user: ${result.data}`);
  }

  // Transaction writes can't return the values, so we have to query for them by email
  const user = await User.query.byEmail({ email }).go();
  return user.data;
}
