import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from "../components/NavBar";
import { useGetPostsQuery } from "../generate/graphql";
import { createUrqlClient } from "../utils/createUrqlClinet";

const Index = () => {
  const [{data}] = useGetPostsQuery();
  return (
    <>
      <NavBar />
      <div>My data is :</div>
      <br />
      {!data ? null : data.getPosts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  );
  };

export default withUrqlClient(createUrqlClient)(Index);
