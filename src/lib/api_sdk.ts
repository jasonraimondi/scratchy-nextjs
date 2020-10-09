import { GraphQLClient } from "graphql-request";
import getConfig from "next/config";

import { getSdk } from "@/generated/graphql";

const { publicRuntimeConfig } = getConfig();

const client = new GraphQLClient(`${publicRuntimeConfig.API_URL}/graphql`, {
  headers: {
    Authorization: "Bearer foo"
  }
});

export const apiSDK = getSdk(client);
