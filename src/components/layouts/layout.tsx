import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { css } from "emotion";
import Head from "next/head";
import "normalize.css/normalize.css";
// import { useRouter } from "next/router";
// import { useEffect } from "react";
import * as React from "react";

export const Layout: React.FC<{ title?: string; isPrivate?: boolean; }> = ({ children, title = "Scratchy Title", isPrivate = false }) => {
  // const { isAuthenticated } = useAuth();
  // const router = useRouter();


  console.log({ isPrivate });
  // if (isPrivate && !isAuthenticated && typeof window !== "undefined") router.push("/register")

  return <React.StrictMode>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
    </Head>
    <main
      className={css`
            height: 100%;
            display: flex;
            flex-direction: column;
            color: ${colors.black};
            background-color: ${colors.blue["500"]};
          `}
    >
      <Header/>
      <div
        className={css`
              flex: 1;
              color: ${colors.black};
              background-color: ${colors.blue["300"]};
            `}
      >
        {children}
      </div>
    </main>
  </React.StrictMode>;
};