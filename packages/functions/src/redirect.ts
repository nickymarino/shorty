import { Link } from "@shorty/core/link";
import { ApiHandler, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const shortPath = usePathParam("shortPath");

  if (!shortPath) {
    return {
      statusCode: 400,
      body: "shortPath is required",
    };
  }

  const foundLinks = await Link.getByShortPath(shortPath);
  console.log({ foundLinks });

  if (foundLinks.length === 0) {
    return {
      statusCode: 404,
      body: "not found",
    };
  }

  return {
    statusCode: 301,
    headers: {
      Location: foundLinks[0].url,
    },
  };
});
