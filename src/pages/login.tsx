import React from "react";

import { Form, Formik } from "formik";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/inputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generate/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClinet";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

import Router from 'next/router';

interface registerProps {}

// to create a mutation/query hook you paste the mutation/query in register.graphql and run "yarn gen" to create the mutation hooks

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant={"small"}>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
            //router.push("/");
              window.location.href= "/"

            }
          }
        }}
      >
        {({ isSubmitting }) => (
          
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or emal"
            />
            <Box>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgett-password">
                <Link ml="auto">forget password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
