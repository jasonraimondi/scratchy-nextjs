import { FormikHelpers } from "formik";
import { GetServerSidePropsContext, NextPage } from "next";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { WithRouterProps } from "next/dist/client/with-router";
import React, { useEffect } from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { LoginFormData } from "@/app/components/forms/login_form";
import { AuthType } from "@/app/lib/auth/use_auth";
import { Redirect } from "@/app/lib/redirect";

// type Props = AuthType & WithRouterProps & {};
//
// const LoginForm = dynamic(() => import("@/app/components/forms/login_form"), { ssr: false });

// const LoginPage: NextPage<Props> = ({
//   login,
//   router: {
//     query: { redirectTo },
//   },
// }) => {
//   const handleSubmit = async (data: LoginFormData, { setSubmitting, setStatus }: FormikHelpers<LoginFormData>) => {
//     try {
//       await login(data);
//       setSubmitting(false);
//       if (!redirectTo || redirectTo.includes("/login")) {
//         redirectTo = "/dashboard";
//       } else if (Array.isArray(redirectTo)) {
//         redirectTo = redirectTo[0];
//       }
//       (window as any).location = redirectTo;
//     } catch (e) {
//       setStatus(e.message);
//     }
//   };
//
//   return (
//     <>
//       <h1 className="h5">Login Page</h1>
//       <LoginForm handleSubmit={handleSubmit} />
//     </>
//   );
// };
//
// export default withLayout(withRouter(LoginPage), {
//   title: "Login Page",
// });


export function base64encode(str: string | Buffer) {
  if (typeof str === "string") str = Buffer.from(str);
  return str.toString("base64");
}

export function base64decode(str: string | Buffer) {
  if (typeof str === "string") str = Buffer.from(str, "base64");
  return str.toString("binary");
}

export function base64urlencode(str: string | Buffer) {
  return base64encode(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

import crypto from "crypto";
import querystring from "querystring";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const codeVerifier = crypto.randomBytes(40).toString("hex");
  const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));

  const query = {
    response_type: "code",
    client_id: "39ce3891-7e0f-4f87-9bc0-db7cc2902266",
    redirect_uri: "http://localhost:8080/catch",
    scope: ["contacts.read", "contacts.write"],
    state: "state-is-a-secret",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  };

  const target = "http://localhost:3000/oauth2/login?" + querystring.stringify(query);
  context.res.writeHead(302, { Location: target });
  context.res.end();
  return {
    props: {}, // will be passed to the page component as props
  }
}

function LoginPage() {
  return <p>Redirecting</p>
}

export default LoginPage;
