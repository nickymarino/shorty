import { User } from "@/functions/core/user";
import { ElectroValidationError } from "electrodb";
import { ApiHandler, useJsonBody } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const { email } = useJsonBody();

  try {
    const newUser = await User.create(email);
    return {
      body: JSON.stringify({
        user: newUser,
      }),
    };
  } catch (e) {
    if (e instanceof ElectroValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            message: "Validation error",
            fields: e.fields,
          },
        }),
      };
    }

    // Otherwise, log it
    console.error({ e });
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Internal server error",
    }),
  };
});
