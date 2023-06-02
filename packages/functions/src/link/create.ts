import { Link } from "@cow-link/core/link";
import { ApiHandler, useJsonBody } from "sst/node/api";

// TODO: use zod to verify the body matches

export const handler = ApiHandler(async (_evt) => {
  const { url, shortPath } = useJsonBody();
  const newLink = await Link.create(shortPath, url);

  return {
    body: JSON.stringify({
      link: newLink,
    }),
  };
});
