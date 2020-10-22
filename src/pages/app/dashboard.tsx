import { Layout } from "@/app/components/layouts/layout";
import { useAuthUser } from "@/app/lib/use_auth_user";
import React from "react";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthUser();

  let body;

  if (!isAuthenticated()) {
    body = <p>Invalid Token</p>;
  } else {
    body = <ul>
      <li>IS AUTHENTICATED YES</li>
      <li>{JSON.stringify(user)}</li>
    </ul>;
  }

  return <Layout title="I am the dashboard" isPrivate={true}>
    {body}
  </Layout>;
};