import React from 'react'

import {Field, Form, Formik} from 'formik';
import { Wrapper } from '../components/wrapper';
import {inputField }from '../components/inputField';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Box, Button, Input } from '@chakra-ui/react';
import { useMutation } from 'urql';

interface registerProps {

}

const REGISTER_MUT = `mutation Register ($username: String!, $password: String! ){
    register(options: {username: $username, password: $password}) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }`



const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useMutation(REGISTER_MUT)
    return (
        <Wrapper variant={'small'}>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={(values) => {
                    console.log(values);
                    return register(values); //or regiater(username: values.username, password: values.password) per essere più precisi
                } }>
                {({ isSubmitting }) => (
                    <><Form>
                        <Field name='username'>
                            {({ field, form }) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel htmlFor='username'>Username</FormLabel>
                                    <Input {...field} id='username' placeholder='username' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                    </Form><Box mt={4}>
                            <Form>
                                <Field name='password'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                                            <FormLabel htmlFor='password'>Password</FormLabel>
                                            <Input {...field} id='password' placeholder='password' />
                                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                            </Form>
                        </Box>
                        <Box>
                            <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                                Register
                            </Button>
                            </Box>
                        </>
                    
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;