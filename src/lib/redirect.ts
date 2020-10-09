import Router from "next/router";
import { NextPageContext } from "next";

export const Redirect = (target: string, context?: NextPageContext) => {
  if (context?.res) {
    context.res.writeHead(302, { Location: target });
    context.res.end();
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.push(target);
  }
};

export const redirectToLogin = async (ctx?: NextPageContext, doNotRedirectBack = false) => {
  let redirectLink = ctx?.pathname ?? document.referrer;

  if (redirectLink) {
    redirectLink = `?redirectTo=${encodeURI(redirectLink)}`;
  }

  if (doNotRedirectBack) {
    redirectLink = "";
  }

  await Redirect(`/login${redirectLink}`, ctx);
};
