import { Box, Link, Flex, Button, color, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generate/graphql";
import { isServer } from "../utils/isServer";
import { Wrapper } from "./wrapper";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  let body = null;

  if (fetching) {
    body = <Box>Fetching</Box>;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex color="white" align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={6} bg="white" color="teal">
          <Link mr={2}>create post</Link>
          </Button>
        </NextLink>
        <Box mr={4}>Hello {data.me.username}</Box>
        <Button
          variant="link"
          color=""
          isLoading={logoutFetching}
          onClick={async() => {
           await logout();
            window.location.href=window.location.href; //refresh the whole page
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (

    <Flex position="sticky" top={0} zIndex={1} bg='teal' p={4} ml="auto" >
      <Flex flex={1} m="auto" align="center" maxW={800}>
      <NextLink href="/">
        <Link>
        <Heading color="white">Reddit</Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
    </Flex>

  );
};
