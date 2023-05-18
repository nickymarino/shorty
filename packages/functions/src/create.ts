import { ApiHandler } from "sst/node/api";
import { Link } from "@cow-link/core/link";

export const handler = ApiHandler(async (_evt) => {
  const newLink = await Link.create("test", "https://google.com");

  return {
    body: {
      link: newLink,
    },
  };
});
