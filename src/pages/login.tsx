import { useEffect } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/use_auth";

export default function LoginPage() {
  const { handleLoginRedirect } = useAuth();

  useEffect(() => {
    handleLoginRedirect();
  }, []);

  return <Layout title="Login">
    <p>Redirecting...</p>
  </Layout>;
}
