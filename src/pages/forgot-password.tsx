import React, { useState } from 'react'

import { Form, Formik } from "formik";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/inputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useForgotPasswordMutation, useLoginMutation } from "../generate/graphql";
import { createUrqlClient } from "../utils/createUrqlClinet";
import { withUrqlClient } from "next-urql";

const ForgotPassword: React.FC<{}> = ({}) => {
        const [complete, setComplete] = useState(false);
        const [, forgotPassword] = useForgotPasswordMutation();
        return (
                <Wrapper variant={"small"}>
                <Formik
                  initialValues={{ email: ""}}
                  onSubmit={async (values) => {
                    await forgotPassword(values);
                    setComplete(true);
                   
                  }}
                >
                  {({ isSubmitting }) => complete ? (<Box>if an account with that email exists, we sent you an email</Box>) : (
                    <Form>
                        <InputField name="email" placeholder="email" label="Email" type="email" />
                      <Flex mt={2}>
                        </Flex>
                      <Button
                        mt={4}
                        type="submit"
                        isLoading={isSubmitting}
                        colorScheme="teal"
                      >
                        forgot password
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Wrapper>);
}

export default withUrqlClient( createUrqlClient)(ForgotPassword);
