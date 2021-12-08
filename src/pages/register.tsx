import React from 'react'

import {Field, Form, Formik} from 'formik';
import { Wrapper } from '../components/wrapper';
//import {inputField }from '../components/inputField';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Box, Button, Input } from '@chakra-ui/react';
import { useRegisterMutation } from '../generate/graphql';

interface registerProps {}

// to create a mutation/query hook you paste the mutation/query in register.graphql and run "yarn gen" to create the mutation hooks

const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation()
    return (
        <Wrapper variant={'small'}>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await register(values); //or regiater(username: values.username, password: values.password) per essere più precisi
                    console.log(response.data.register.errors);
                    if(response.data?.register.errors) {
                        setErrors({
                            username: "ERROR",
                        });
                    }
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
                    <Box mt={10}>
                                <Field name='password'>
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                                            <FormLabel htmlFor='password'>Password</FormLabel>
                                            <Input {...field} id='password' placeholder='password' />
                                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                        </Box>
                        <Box>
                            <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                                Register
                            </Button>
                            </Box>
                            </Form>
                        </>
                    
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;