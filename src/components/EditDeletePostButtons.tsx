import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generate/graphql";
interface EditDeletePostButtonsPorps {
  id: number;
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonsPorps> = ({
  id,
}) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} mr={4} aria-label="Edit" icon={<EditIcon />} />
      </NextLink>
      <IconButton
        aria-label="delete"
        icon={<DeleteIcon />}
        onClick={() => deletePost({ id })}
      />
    </Box>
  );
};


