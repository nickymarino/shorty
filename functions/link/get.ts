import { get } from "@/functions/core/entities/link";
import { ApiHandler, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async () => {
  const uid = usePathParam("id");
  if (!uid) {
    throw new Error("Missing id");
  }
  const result = await get(uid);
  return {
    body: JSON.stringify({
      link: result,
    }),
  };
});
