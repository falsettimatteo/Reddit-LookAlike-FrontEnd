import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { InputField } from '../components/inputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/wrapper';
import { useCreatePostMutation, useMeQuery } from '../generate/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';
import { useIsAuth } from '../utils/useIsAuth';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,createPost] = useCreatePostMutation();
    useIsAuth(); // if user is not logged in it re-direct it to login page
        return (
            <Layout variant='small'>
                <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const {error} = await createPost({input: values});
          if(!error){                                              //there is a global handler fot "not authenticated" in createUrqlClient.graphql
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box>
              <InputField textarea name="text" placeholder="text" label="Body" />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create post
            </Button>
          </Form>
        )}
      </Formik>
      </Layout>
        );
}

export default withUrqlClient(createUrqlClient, {ssr: true}) (CreatePost);