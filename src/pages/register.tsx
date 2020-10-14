import { FormikHelpers } from "formik";
import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { redirectToLogin } from "@/app/lib/redirect";
import dynamic from "next/dynamic";
import { apiSDK } from "@/app/lib/api_sdk";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const RegisterForm = dynamic(() => import("@/app/components/forms/register_form"), { ssr: false });

export default function Register() {
  const handleSubmit = async (
    registerFormData: RegisterFormData,
    { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>
  ) => {
    try {
      await apiSDK.Register({ data: registerFormData });
    } catch (e) {
      setStatus(e.message);
    }
    setSubmitting(false);
    await redirectToLogin(undefined, true);
  };

  return (
    <Layout title="Register Page">
      <h1>Register Page</h1>
      <RegisterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};
