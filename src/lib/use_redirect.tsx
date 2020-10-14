import React, { useEffect } from "react";
import Router from "next/router";

export const useRedirect = (redirectTo?: string) => {
  useEffect(() => {
    if (redirectTo) {
      Router.push(redirectTo);
    }
  }, [redirectTo]);
  return <p>Redirecting to {redirectTo ?? "Unknown"}...</p>;
};