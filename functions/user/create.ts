import { User } from "@/functions/core/user";
import { ApiHandler, useJsonBody } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const { email } = useJsonBody();
  const newUser = await User.create(email);

  return {
    body: JSON.stringify({
      user: newUser,
    }),
  };
});
