import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generate/graphql";

export const useIsAuth = () => {
    const [{data, fetching}] = useMeQuery()
    useEffect(() => {
      if(!fetching && !data?.me) {
        router.replace("/login?next="+ router.pathname); //next is the next page to go after the login
      }
    },  [fetching, data, router])
}