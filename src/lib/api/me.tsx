import useSWR from "swr";

import { graphQLSdk } from "@/app/lib/api_sdk";

const meFetcher = () => graphQLSdk.Me();

export const useApiMe = () => {
  const res = useSWR("/graphql/me", meFetcher);
  const { data, error } = res;
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
