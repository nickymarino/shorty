import { Link } from "@cow-link/core/link";
import { ApiHandler, usePathParam } from "sst/node/api";

// TODO: use sentry's (?) throw notFound(...)

export const handler = ApiHandler(async (_evt) => {
  const shortPath = usePathParam("shortPath");

  if (!shortPath) {
    return {
      body: {
        statusCode: 400,
        body: "shortPath is required",
      },
    };
  }

  const foundLinks = await Link.getByShortPath(shortPath);
  console.log({ foundLinks });

  if (foundLinks.length === 0) {
    return {
      body: {
        statusCode: 404,
        body: "not found",
      },
    };
  }

  return {
    statusCode: 301,
    headers: {
      Location: foundLinks[0].url,
    },
  };
});
