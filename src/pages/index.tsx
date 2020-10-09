import React from "react";
import { NextPage } from "next";
import useSWR from "swr";

import { withLayout } from "@/app/components/layouts/layout";
import { apiSDK } from "@/app/lib/api_sdk";

const userFetcher = () => apiSDK.Users({ query: { limit: 2, order: "DESC" } })
const useUser = (email: string) => {
  const { data, error } = useSWR(email, userFetcher);

  const list = data?.users.data;
  const cursor = data?.users.cursor;

  return {
    list,
    cursor,
    isLoading: !error && !data,
    isError: error
  }
}

const Index: NextPage<any> = () => {
  const { list, cursor, isLoading, isError } = useUser("jason@raimondi.us");
  console.log(list, isLoading, isError);
  if (isError) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {JSON.stringify(cursor)} {JSON.stringify(list)}!</div>

  // let body;
  // if (!data) {
  //   body = <p>loading...</p>;
  // } else {
  //   body = (
  //     <>
  //       <p>users:</p>
  //       <ul>
  //         {data.users.map((x: any) => (
  //           <li key={x.uuid}>{x.email}</li>
  //         ))}
  //       </ul>
  //     </>
  //   );
  // }
  //
  // return <div>{body}</div>;
};

export default withLayout(Index, {
  title: "Hi ya slugger",
});
