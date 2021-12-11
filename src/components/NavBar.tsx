import { Box, Link, Flex, Button, color } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generate/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
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
      <Flex color="white">
        <Box mr={4}>Hello {data.me.username}</Box>
        <Button
          variant="link"
          color=""
          isLoading={logoutFetching}
          onClick={() => {
            logout();
           // window.location.href=window.location.href; //refresh the whole page
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="teal" p={4} ml="auto">
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
