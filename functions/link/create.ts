import { create } from "@/functions/core/entities/link";
import { ApiHandler, useJsonBody } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const { url, shortPath, userId } = useJsonBody();
  const newLink = await create({ shortPath, url, userId });

  return {
    body: JSON.stringify({
      link: newLink,
    }),
  };
});
