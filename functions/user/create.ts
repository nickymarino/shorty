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
    // Log the error no matter what
    console.error({ e });

    // Handle known error types
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
    } else if (e instanceof User.EmailNotUniqueError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            message: "Email already in use",
          },
        }),
      };
    }
  }

  // Fallback on 500
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Internal server error",
    }),
  };
});
