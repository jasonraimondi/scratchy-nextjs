import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/auth/use_auth";
import React from "react";

export default function Dashboard() {
  const { accessToken } = useAuth();

  let body;

  if (!accessToken) {
    body = <p>Invalid Token</p>;
  } else {
    body = <ul>
      <li>{accessToken.token}</li>
      <li>{accessToken.expiresAt}</li>
      <li>{accessToken.userId}</li>
    </ul>;
  }

  return <Layout title="I am the dashboard" isPrivate={true}>
    <div>
      {body}
    </div>
  </Layout>;
};