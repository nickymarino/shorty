import { Link } from "@cow-link/core/link";
import { ApiHandler, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const newLink = await Link.create("test", "https://google.com");

  return {
    body: {
      link: newLink,
    },
  };
});
