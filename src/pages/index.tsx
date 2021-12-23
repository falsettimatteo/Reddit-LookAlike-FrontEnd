import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useGetPostsQuery } from "../generate/graphql";
import { createUrqlClient } from "../utils/createUrqlClinet";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Link,
  Text
} from "@chakra-ui/react";

import { UpdootSection } from "../components/UpdootSection";


const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useGetPostsQuery({
    variables: variables,
  });

  if (!fetching && !data) {
    console.log(fetching);
    return <div>Query error - no data</div>;
  }
  return (
    <Layout>

      <br />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : ( 
        <Stack spacing={8}>
          {data!.getPosts.posts.map((p) => (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box>
                <NextLink href={"post/[id]"} as={`/post/${p.id}`}>
                <Link>
                <Heading fontSize="xl">{p.title}</Heading>
                </Link>
                </NextLink>
                <Text>Posted by: {p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.getPosts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data.getPosts.posts[data.getPosts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);

