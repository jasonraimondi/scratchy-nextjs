import { FormikHelpers } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

import { RegisterFormData } from "@/app/components/forms/register_form";
import { Layout } from "@/app/components/layouts/layout";
import { graphQLSdk } from "@/app/lib/api_sdk";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const RegisterForm = dynamic(() => import("@/app/components/forms/register_form"), { ssr: false });

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (
    registerFormData: RegisterFormData,
    { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>
  ) => {
    try {
      await graphQLSdk.Register({ data: registerFormData });
    } catch (e) {
      setStatus(e.message);
    }
    setSubmitting(false);
    await router.push("/register/success")
  };

  return (
    <Layout title="Register Page">
      <h1>Register Page</h1>
      <RegisterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};
