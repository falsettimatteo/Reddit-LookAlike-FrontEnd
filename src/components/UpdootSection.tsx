import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { GetPostsQuery, useGetVoteStatusQuery, useVoteMutation } from "../generate/graphql";

interface UpdootSectionProps {

  post: GetPostsQuery["getPosts"]["posts"][0];
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  
  const [{ fetching, operation }, vote] = useVoteMutation();

  const [loadingState, setloadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  return (
    <Flex alignItems="center" direction="column" justifyContent="center" mr={6}>
      <IconButton
        aria-label="UP vote"
        colorScheme={post.voteStatus ===  1 ? "green" : undefined}
        onClick={async () => {
          if(post.voteStatus === 1)return;
          setloadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setloadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        icon={<ChevronUpIcon w={10} h={10} />}
      />

      <Box>{post.points}</Box>
      <IconButton
        aria-label="DOWN vote"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          if(post.voteStatus === -1)return;
          setloadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setloadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        icon={<ChevronDownIcon w={10} h={10} />}
      />
      
    </Flex>
  );
};
