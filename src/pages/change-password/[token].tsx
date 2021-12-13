import { Box, Button, Flex, Link} from '@chakra-ui/react';
import { query } from '@urql/exchange-graphcache';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/inputField';
import { Wrapper } from '../../components/wrapper';
import { useChangePasswordMutation } from '../../generate/graphql';
import { createUrqlClient } from '../../utils/createUrqlClinet';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';



const ChangePassword: NextPage = () => {
        const [, changePassword] = useChangePasswordMutation();
        const router = useRouter();
        const [tokenError, setTokenErrorr] = useState('')
        return (<Wrapper variant={"small"}>
        <Formik
          initialValues={{ newPassword: ""}}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({ 
              token: typeof router.query.token ==='string'? router.query.token : "",
               password: values.newPassword
              });

            if (response.data?.changePassword.errors) {
                const errorMap = toErrorMap(response.data.changePassword.errors)
                if( 'token' in errorMap){
                    setTokenErrorr(errorMap.token)
                }
              setErrors(errorMap);
            } else {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="newPassword" placeholder="new password" label="new password" type="password" />
              {tokenError ?
              <Flex>
              <Box mr={4} color="red">
                  <NextLink href="/forgett-password" />
              <Link>go get a new one</Link>
              </Box>
              </Flex>
              : null}
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                change password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
        );
}


export default withUrqlClient(createUrqlClient)( ChangePassword);

