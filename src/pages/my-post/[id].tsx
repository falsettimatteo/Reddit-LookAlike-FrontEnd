import {
    Box,
    Button,
    Flex,
    Heading, Link, Stack, Text
  } from "@chakra-ui/react";
  import { withUrqlClient } from "next-urql";
  import NextLink from "next/link";
import { useRouter } from "next/router";
  import React, { useState } from "react";
  import { EditDeletePostButton } from   "../../components/EditDeletePostButtons"  //"../components/EditDeletePostButtons";
  import { Layout } from "../../components/Layout";
  import { UpdootSection } from "../../components/UpdootSection";
  import {
    useDeletePostMutation,
    useGetPostsQuery,
    useGetUserPostsQuery,
    useMeQuery
  } from "../../generate/graphql";
  import { createUrqlClient } from "../../utils/createUrqlClinet";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
  
 
  
  const UserPosts: React.FC<{}> = ({}) => {
    const router = useRouter();
    const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

    const [variables, setVariables] = useState({
      userId: intId,
        limit: 10,
      cursor: null as null | string,
    });
    const [{ data, fetching }] = useGetUserPostsQuery({
      variables: variables,
    });
    const [{data: meData}] = useMeQuery();
  
  
    if (!fetching && !data) {
      return <div>Query error - no data</div>;
    }
    return (
      <Layout postsViewButton="myPosts">
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            {data!.getUserPosts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <Box>
                    <UpdootSection post={p} />
                  </Box>
                  <Box flex={1}>
                    <NextLink href={"post/[id]"} as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>Posted by: {p.creator.username}</Text>
                    <Flex>
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      {meData?.me?.id !== p.creator.id ? null : (
                        <Box ml="auto">
                        <EditDeletePostButton id={p.id} />
                        </Box>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}
        {data && data.getUserPosts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                    userId: intId,
                  limit: variables.limit,
                  cursor:
                    data.getUserPosts.posts[data.getUserPosts.posts.length - 1].createdAt,
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
  
  export default withUrqlClient(createUrqlClient, { ssr: true })(UserPosts);
  