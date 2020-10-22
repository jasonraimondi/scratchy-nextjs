import useSWR, { ConfigInterface } from "swr";

import { graphQLSdk } from "@/app/lib/api_sdk";
import { Order } from "@/generated/graphql";

const userFetcher = () => graphQLSdk.Users({ query: { limit: 10, order: Order.Desc } });

export const useUser = (email: string, config?: ConfigInterface) => {
  return useSWR(`/api/user/${email}`, userFetcher, config);
};
