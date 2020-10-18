import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/use_auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, redirectToLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/app/dashboard?message=access-token-is-still-valid")
    } else {
      redirectToLogin();
    }
  }, []);

  return <Layout title="Login">
    <p>This is wrong... The login decision needs to exist in the nunjucks template on the oauth2 server</p>
  </Layout>;
}
