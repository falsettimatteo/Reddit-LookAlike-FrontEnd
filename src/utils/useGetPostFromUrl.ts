import { useGetPostQuery } from "../generate/graphql";
import { UseGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const IntId = UseGetIntId();
  return useGetPostQuery({
    pause: IntId === -1,
    variables: {
      id: IntId,
    },
  });
}