import { Link } from "@/functions/core/link";
import { ApiHandler, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const result = await Link.list();
  return {
    body: JSON.stringify({
      links: result,
    }),
  };
});
