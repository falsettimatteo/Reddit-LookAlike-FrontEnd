import * as React from 'react'

import {Field, Form, Formik} from 'formik';
import { Wrapper } from '../components/wrapper';
import {InputField} from '../components/inputField';

import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Box, Button, Input } from '@chakra-ui/react';
import { useRegisterMutation } from '../generate/graphql';

interface registerProps {}

// to create a mutation/query hook you paste the mutation/query in register.graphql and run "yarn gen" to create the mutation hooks

const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant={'small'}>
            <Formik initialValues={{ username: "", password: "" }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await register(values); //or regiater(username: values.username, password: values.password) per essere più precisi

                    if(response.data?.register.errors) {
                        setErrors({
                            username: "ERROR INPUT"})
                    }

                } }>
                {({ isSubmitting}) => (
                    <Form>
                        <InputField name= "username" label="Username"/>
                        <Box>
                        <InputField name="password" label="Password" />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
                            Register
                        </Button>
                    </Form>
                    
                )}
            </Formik>
        </Wrapper>
    );
}

export default Register;