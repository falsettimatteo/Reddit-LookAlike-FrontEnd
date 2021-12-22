import { dedupExchange, fetchExchange } from "urql";
import {cacheExchange, Resolver} from "@urql/exchange-graphcache"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation, VoteMutationVariables } from "../generate/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

import {pipe,tap} from 'wonka';
import {Exchange} from 'urql';
import router from "next/router";

import { stringifyVariables } from '@urql/core';
import { gql } from '@urql/core';

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


export const cursorPagination = (): Resolver => {


  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const results: string[] = [];
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
    info.partial = !isItInTheCache;
    let hasMore = true;

    fieldInfos.forEach(fi => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if(!_hasMore){
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    })
    return {
      __typename: 'PaginatedPosts',
      posts: results,
      hasMore,

    };

   };
};


export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:5000/graphql",
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers:{
          Query: {
            getPosts: cursorPagination(),
          }
        },
        //this function are used to reload the query and update the react components
        updates: {
          Mutation: {
           vote: (_result, args, cache, info) => {
              const {postId, value} = args as VoteMutationVariables;

              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                  }
                `,
                { id: postId } as any
              );
              if(data){
                const newPoints = data.points + value;
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                    }
                  `,
                  { id: postId, points: newPoints } as any
                );

              }
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName ==='getPosts'
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query","getPosts", fi.arguments || {});
              })
            },
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