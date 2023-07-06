import { create, GithubIdNotUniqueError } from "@/functions/core/entities/user";
import { ElectroValidationError } from "electrodb";
import { ApiHandler, useJsonBody } from "sst/node/api";

export const handler = ApiHandler(async () => {
  const { githubId } = useJsonBody();

  try {
    const newUser = await create({ githubId });
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
    } else if (e instanceof GithubIdNotUniqueError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            message: "Github ID already exists",
          },
        }),
      };
    }
  }

  // Fallback on 500
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Could not create user",
    }),
  };
});
