import { FormikHelpers } from "formik";
import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { ForgotPasswordFormData } from "@/app/components/forms/forgot_password_form";
import { Redirect } from "@/app/lib/redirect";
import dynamic from "next/dynamic";
import { apiSDK } from "@/app/lib/api_sdk";

const ForgotPasswordForm = dynamic(() => import("@/app/components/forms/forgot_password_form"), { ssr: false });

export default function ForgotPassword() {
  const handleSubmit = async (
    data: ForgotPasswordFormData,
    { setSubmitting }: FormikHelpers<ForgotPasswordFormData>
  ) => {
    await apiSDK.SendForgotPasswordEmail({ email: data.email });
    await Redirect("/");
    setSubmitting(false);
  };

  return (
    <Layout title="Login Page">
      <h1 className="h5">Forgot Password Page</h1>
      <ForgotPasswordForm handleSubmit={handleSubmit} />
    </Layout>
  );
};
