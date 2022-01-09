import React from "react";

import { Form, Formik } from "formik";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/inputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generate/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClinet";
import { withUrqlClient } from "next-urql";

interface registerProps {}


const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant={"small"}>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values }); 

          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {

            router.push("/");
          }
          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" label="Username" />
            <Box>
              <InputField name="email" label="Email" />
            </Box>
            <Box>
              <InputField name="password" label="Password" type="password" />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: false})(Register);
