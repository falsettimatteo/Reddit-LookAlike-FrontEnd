
import { GetServerSideProps } from 'next';


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // redirect test: always redirect to '/
  ctx.res.setHeader('Location', '/');
  ctx.res.statusCode = 302;
  ctx.res.end();
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props:{},
  };
};
