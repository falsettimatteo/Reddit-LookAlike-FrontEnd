import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/inputField";
import { Layout } from "../../../components/Layout";
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../../generate/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClinet";
import { UseGetIntId } from "../../../utils/useGetIntId";

const EditPost = ({}) => {
    const router = useRouter()
  const IntId = UseGetIntId();
  const [, updatePost] = useUpdatePostMutation();
  const [{ data, fetching }] = useGetPostQuery({
    pause: IntId === -1,
    variables: {
      id: IntId,
    },
  });
  if (fetching) {
    return <Layout>Loading...</Layout>;
  }
  if (!data?.getPost) {
    return (
      <Layout>
        <Box>Could not find your post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.getPost.title, text: data.getPost.text }}
        onSubmit={async (values) => {
          await updatePost({ id: IntId, ...values });
         router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box>
              <InputField
                textarea
                name="text"
                placeholder="text"
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
