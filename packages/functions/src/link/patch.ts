import { Link } from "@shorty/core/link";
import { ApiHandler, useJsonBody, usePathParam } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  const linkUid = usePathParam("uid");
  const newAttributes = useJsonBody();
  if (!linkUid) {
    return {
      statusCode: 400,
      body: "link uid is required",
    };
  }

  const foundLink = await Link.get(linkUid);
  console.log({ foundLink });
  if (!foundLink) {
    return {
      statusCode: 404,
      body: "not found",
    };
  }

  const updatedLink = await Link.patch(foundLink.uid, newAttributes);
  console.log({ updatedLink });

  return {
    statusCode: 200,
    body: JSON.stringify({
      link: updatedLink,
    }),
  };
});
