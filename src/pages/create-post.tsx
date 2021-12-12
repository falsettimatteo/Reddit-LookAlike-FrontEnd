import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/inputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/wrapper';
import { useCreatePostMutation } from '../generate/graphql';
import { createUrqlClient } from '../utils/createUrqlClinet';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,createPost] = useCreatePostMutation();
        return (
            <Layout variant='small'>
                <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          await createPost({input: values});
          router.push("/");
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

export default withUrqlClient(createUrqlClient) (CreatePost);