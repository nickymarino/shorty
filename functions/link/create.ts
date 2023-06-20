import { create } from "@/functions/core/entities/link";
import { ApiHandler, useJsonBody } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const { url, shortPath } = useJsonBody();
  const newLink = await create(shortPath, url);

  return {
    body: JSON.stringify({
      link: newLink,
    }),
  };
});
