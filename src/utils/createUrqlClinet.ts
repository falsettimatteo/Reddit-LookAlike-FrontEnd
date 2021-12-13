import { dedupExchange, fetchExchange } from "urql";
import {cacheExchange} from "@urql/exchange-graphcache"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generate/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

import {pipe,tap} from 'wonka';
import {Exchange} from 'urql';
import router from "next/router";

const errorExchange: Exchange = ({forward}) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({error}) => {
      if(error){
        if(error?.message.includes("not authenticated")){
          router.replace("/login");
        }
      }
    })
  )
}



export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        //this function are used to reload the query and update the react components
        updates: {
          Mutation: {
            logout: (_result, args, cache, info) => {
              //refresh the query logout to set me to null
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
})