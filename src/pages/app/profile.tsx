import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useApiMe } from "@/app/lib/api/me";

export default function Profile() {
  const { data, isLoading, isError } = useApiMe();

  console.log({data, isLoading, isError })

  let body;

  if (isError) {
    body = <div>failed to load</div>;
  } else if (isLoading) {
    body = <div>loading...</div>;
  } else {
    body = <div>hello {JSON.stringify(data)}!</div>;
  }

  return <Layout title="profile" isPrivate={true}>{body}</Layout>;
};
