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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Link = {
  shortPath: string;
  url: string;
  uid: string;
  createdAt: number;
  updatedAt: number;
};

export const getServerSideProps: GetServerSideProps<{
  links: Link[];
}> = async (context) => {
  const endpoint = `${Api.api.url}/links`;
  const res = await fetch(endpoint);
  const data = await res.json();

  const retVal = { props: JSON.parse(data.body) };
  console.log({ retVal });
  return retVal;
};

function LinkTable({ links }: { links: Link[] }) {
  function toTimestamp(epoch: number) {
    return new Date(epoch).toString();
  }

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Short Path</TableCell>
          <TableCell>URL</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Updated</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {links.map((row) => (
          <TableRow
            key={row.uid}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.shortPath}
            </TableCell>
            <TableCell>{row.url}</TableCell>
            <TableCell>{toTimestamp(row.createdAt)}</TableCell>
            <TableCell>{toTimestamp(row.updatedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Home({ links }: { links?: Link[] }) {
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
        {links && LinkTable({ links })}

        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
