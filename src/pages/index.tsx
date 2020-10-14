import { Layout } from "@/app/components/layouts/layout";
import { apiSDK } from "@/app/lib/api_sdk";
import { useAuth } from "@/app/lib/auth/use_auth";
import React from "react";
import useSWR from "swr";

const userFetcher = () => apiSDK.Users({ query: { limit: 2, order: "DESC" } });
const useUser = (email: string) => {
  const { data, error } = useSWR(email, userFetcher);

  const list = data?.users.data;
  const cursor = data?.users.cursor;

  return {
    list,
    cursor,
    isLoading: !error && !data,
    isError: error,
  };
};

export default function IndexPage() {
  const { list, cursor, isLoading, isError } = useUser("jason@raimondi.us");
  const auth = useAuth();

  let body;

  console.log("at", auth.accessToken)

  if (isError) {
    body = <div>failed to load</div>;
  } else if (isLoading) {
    body = <div>loading...</div>;
  } else {
    body = <div>hello {JSON.stringify(cursor)} {JSON.stringify(list)}!</div>;
  }

  return <Layout title="hompeage">{body}</Layout>;
};
