import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Link,
  Flex,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generate/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {
  postsViewButton?: "allPosts" | "myPosts";
}

export const NavBar: React.FC<NavBarProps> = ({
  postsViewButton = "allPosts",
}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // pause: !isServer(),
  });
  const router = useRouter();
  let body = null;
  if (fetching) {
    body = <Box>Fetching</Box>;
  } else if (!data?.me) {
    body = (
      <>
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
    Actions
  </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/login")}>Login</MenuItem>
            <MenuItem onClick={() => router.push("/register")}>Register</MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <Box fontSize={25} color="white" mr={4}>
          Hello {data.me.username}
        </Box>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
          />
          <MenuList>
            <MenuItem onClick={() => router.push("/create-post")}>Create post</MenuItem>
            {postsViewButton ==="allPosts" ? <MenuItem onClick={() => router.push(`/my-post/${data.me.id}`)}>My posts</MenuItem>
            :<MenuItem onClick={() => router.push(`/`)}>All posts</MenuItem> }
            <MenuItem onClick={async () => {
            await logout();
            router.reload(); //refresh the whole page
          }}>Logout</MenuItem>
          </MenuList>
        </Menu>
      
      </Flex>
    );
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="teal" p={4} ml="auto">
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading color="white">Post-it</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
