import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import React from "react";
import { GetPostsQuery, useVoteMutation } from "../generate/graphql";

interface UpdootSectionProps {
  post: GetPostsQuery['getPosts']['posts'][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  return (
    <Flex alignItems="center" direction="column" justifyContent="center" mr={6}>
      <IconButton aria-label="UP vote" onClick={() => vote({
          postId: post.id,
          value: 1,
      })}>
        <ChevronUpIcon w={10} h={10} />
      </IconButton>
      <Box>{post.points}</Box>
      <IconButton aria-label="DOWN vote" onClick={() => vote({
          postId: post.id,
          value: -1,
      })}>
        <ChevronDownIcon w={10} h={10} />
      </IconButton>
    </Flex>
  );
};
