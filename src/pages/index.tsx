import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../Link";
import ProTip from "../ProTip";
import Copyright from "../Copyright";
import { GetServerSideProps } from "next";
import { Api } from "sst/node/api";
import "util";

type Link = {
  shortPath: string;
  url: string;
  uid: string;
};

export const getServerSideProps: GetServerSideProps<{
  links: Link[];
}> = async (context) => {
  const endpoint = `${Api.api.url}/links`;
  const res = await fetch(endpoint);
  const data = await res.json();

  return { props: data.body };
};

export default function Home({ links }: { links: Link[] }) {
  console.log({ links });
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Hello, world!
        </Typography>
        {links &&
          links.map((link) => (
            <Typography
              variant="body1"
              component="p"
              gutterBottom
              key={link.uid}
            >
              {link.shortPath} - {link.url}
            </Typography>
          ))}

        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
