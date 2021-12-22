import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { GetPostsQuery, useVoteMutation } from "../generate/graphql";

interface UpdootSectionProps {
  post: GetPostsQuery['getPosts']['posts'][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [{fetching, operation}, vote] = useVoteMutation();
  const [loadingState, setloadingState] = useState<
  "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  return (
    <Flex alignItems="center" direction="column" justifyContent="center" mr={6}>
      <IconButton aria-label="UP vote" onClick={async() => {
        setloadingState("updoot-loading");
        await vote({  
          postId: post.id,
          value: 1,
      })
    setloadingState("not-loading");
    }}
    isLoading={loadingState === "updoot-loading"}>
        <ChevronUpIcon w={10} h={10} />
      </IconButton>
      <Box>{post.points}</Box>
      <IconButton aria-label="DOWN vote" 
      onClick={async() => {
        setloadingState("downdoot-loading");
        await vote({
          postId: post.id,
          value: -1,
      })
      setloadingState("not-loading");
      }}
      isLoading={loadingState === 'downdoot-loading'}>
        <ChevronDownIcon w={10} h={10} />
      </IconButton>
    </Flex>
  );
};
