import { Layout } from "@/app/components/layouts/layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { Redirect } from "@/app/lib/redirect";
import { apiSDK } from "@/app/lib/api_sdk";

export default function VerifyEmail() {
  const router = useRouter();
  const { e, u } = router.query;
  const email = Array.isArray(e) ? e[0] : e;
  const id = Array.isArray(u) ? u[0] : u;

  if (!email || !id) {
    router.push("/?message=something went wrong")
  }

  const verifyEmailData = { email, id };
  const [status, setStatus] = useState("Verifying Email...");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleVerifyUser = async () => {
    await apiSDK.VerifyEmailConfirmation({ data: verifyEmailData }).catch(e => {
      setStatus(e.message);
      Redirect(`/login?message=${encodeURI(e.message)}`);
    });
    setStatus("Success! Redirecting to login...");
    await sleep(750);
    await Redirect("/login");
  };

  useEffect(() => {
    handleVerifyUser().catch(e => console.error(e));
  }, []);

  return <Layout title="Verify Email">
    <h1 className="h5">{status}</h1>
  </Layout>;
};