import { graphQLSdk } from "@/app/lib/api_sdk";
import { Order } from "@/generated/graphql";
import useSWR from "swr";

export const apiUsersFetcher = () => graphQLSdk.Users({ query: { limit: 10, order: Order.Desc } });

export const useApiUsers = (initialData: any) => {
  const { data, error } = useSWR(`/api/users`, apiUsersFetcher, { initialData });
  return {
    data: data?.data,
    cursor: data?.cursor,
    isLoading: !error && !data,
    isError: error,
  };
};
