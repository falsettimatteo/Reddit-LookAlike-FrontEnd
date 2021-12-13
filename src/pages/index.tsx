import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { useGetPostsQuery } from "../generate/graphql";
import { createUrqlClient } from "../utils/createUrqlClinet";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const Index = () => {
  const [{data}] = useGetPostsQuery({
    variables: {
      limit: 10,
    }
  });
  return (
    <Layout>
      <NextLink href="/create-post">
      <Link>create post</Link>
      </NextLink>
      <br />
      {!data ? null : data.getPosts.map(p => <div key={p.id}>{p.title}</div>)}
    </ Layout>
  );
  };

export default withUrqlClient(createUrqlClient)(Index);
