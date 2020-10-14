import { Layout } from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/auth/use_auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, redirectToLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard?message=access-token-is-still-valid")
    }
  }, []);

  const handleLoginGoogle = () => alert("implement login with google")
  const handleLoginEmail = () => redirectToLogin();

  return <Layout title="Login">
    <button onClick={handleLoginGoogle}>Login with Google</button>
    <button onClick={handleLoginEmail}>Login with Email</button>
  </Layout>;
}
