import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { EditDeletePostButton } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { useGetPostQuery, useMeQuery } from "../../generate/graphql";
import { createUrqlClient } from "../../utils/createUrqlClinet";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

interface Post {}

export const Post = ({}) => {

  const [{data: meData}] = useMeQuery()
  const [{ data, fetching }] = useGetPostFromUrl()
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
        {meData?.me?.id !== data.getPost.creator.id ? null : (
                      <Box ml="auto">
                      <EditDeletePostButton id={data.getPost.creator.id} />
                      </Box>
                    )}
      </Layout>
    );
  
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
