import { Link } from "@cow-link/core/link";
import { ApiHandler, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const uid = usePathParam("id");
  if (!uid) {
    throw new Error("Missing id");
  }
  const result = await Link.get(uid!);
  return {
    body: {
      link: result,
    },
  };
});
