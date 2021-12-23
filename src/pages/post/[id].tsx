import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { useGetPostQuery } from "../../generate/graphql";
import { createUrqlClient } from "../../utils/createUrqlClinet";

interface Post {}

export const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = useGetPostQuery({
    pause: intId === -1, //if the value is -1 the query get stopped
    variables: {
      id: intId,
    },
  });
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  if (!data?.getPost) {
    return (
      <Layout>
        <Box>Could not find your post</Box>
      </Layout>
    );
  } 
    return (
      <Layout>
        <Heading mb={4}>{data.getPost.title}</Heading>
        {data.getPost.text}
      </Layout>
    );
  
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
