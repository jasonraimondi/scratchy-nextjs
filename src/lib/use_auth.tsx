import crypto from "crypto";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import querystring from "querystring";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { graphQLClient } from "@/app/lib/api_sdk";
import { base64urlencode } from "@/app/lib/utils/base64";
import { httpClient } from "@/app/lib/http_client";

type DecodedJWT = {
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  cid: string;
  scope: string;

  email: string;
  isActive: boolean;
}

type DecodedAccessToken = {
  token: string;
  expiresAt: number;
  userId: string;
  email: string;
  isActive: string;
}

type DecodedRefreshToken = {
  token: string;
  expiresAt: number;
  userId: string;
}

const clientId = process.env.NEXT_PUBLIC_API_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_API_URL_REDIRECT;

// @ts-ignore
const AuthContext = createContext<UseAuth>();

const COOKIE = {
  codeVerifier: "code_verifier",
  codeChallenge: "code_challenge",
  state: "state",
  accessToken: "access_token",
  refreshToken: "refresh_token",
};

const isAccessTokenValid = (accessToken?: DecodedAccessToken) => {
  return !(Date.now() / 1000 > (accessToken?.expiresAt ?? 0));
};

function AuthProvider(props: any) {
  const router = useRouter();
  const cookies = useMemo(() => parseCookies(), []);
  const [accessToken, setAccessToken] = useState<DecodedAccessToken | undefined>(cookies.access_token ? JSON.parse(cookies.access_token) : undefined);
  const [refreshToken, setRefreshToken] = useState<DecodedRefreshToken | undefined>(cookies.refresh_token ? JSON.parse(cookies.refresh_token) : undefined);
  const isAuthenticated = useMemo(() => isAccessTokenValid(accessToken), [accessToken]);

  useEffect(() => {
    if (accessToken) graphQLClient.setHeader("Authorization", "Bearer " + accessToken.token);
  }, [accessToken]);

  const redirectToLogin = async (provider: "self" | "google" = "self") => {
    const state = base64urlencode(crypto.randomBytes(5));
    const codeVerifier = base64urlencode(crypto.randomBytes(40));
    const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));
    const redirectQuery = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ["contacts.read", "contacts.write"],
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      provider,
    };
    setCookie(undefined, COOKIE.codeVerifier, codeVerifier, { path: "/", maxAge: 60 * 10 });
    setCookie(undefined, COOKIE.state, state, { path: "/", maxAge: 60 * 10 });
    const redirectTo = process.env.NEXT_PUBLIC_API_URL + "/oauth2/authorize" + "?" + querystring.stringify(redirectQuery);
    await router.push(redirectTo);
  };

  const logout = async () => {
    destroyCookie(undefined, COOKIE.codeVerifier);
    destroyCookie(undefined, COOKIE.state);
    destroyCookie(undefined, COOKIE.accessToken);
    destroyCookie(undefined, COOKIE.refreshToken);
    setAccessToken(undefined);
    setRefreshToken(undefined);
    // await client("/logout", { method: "POST" });
    await router.replace("/");
  };

  const receiveToken = async (code: string, incomingState: string): Promise<boolean> => {
    const codeVerifier = cookies[COOKIE.codeVerifier];
    const existingState = cookies[COOKIE.state];

    if (!codeVerifier) {
      console.error("NO CODE VERIFIER");
      return false;
    }

    if (incomingState !== existingState) {
      console.error(`INVALID STATE ${incomingState} ${existingState}`);
      return false;
    }

    const body: any = {
      code,
      state: existingState,
      code_verifier: codeVerifier,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    const url = process.env.NEXT_PUBLIC_API_URL + "/oauth2/token"

    const response = await httpClient(url, { body });

    if (response.message) {
      console.error(response.message);
      return false;
    }

    if (response.access_token) setTokenCookie(response.access_token, COOKIE.accessToken as any);
    if (response.refresh_token) setTokenCookie(response.refresh_token, COOKIE.refreshToken as any);

    destroyCookie(undefined, COOKIE.codeVerifier);
    destroyCookie(undefined, COOKIE.state);
    return true;
  };

  // type needs to be COOKIE.accessToken || COOKIE.refreshToken
  const setTokenCookie = (token: string, type: "access_token"|"refresh_token") => {
    const decodedToken: DecodedJWT | any = jwt_decode(token);

    if (type === COOKIE.accessToken) {
      const result: DecodedAccessToken = {
        token,
        userId: decodedToken.sub,
        expiresAt: decodedToken.exp,
        email: decodedToken.email,
        isActive: decodedToken.isActive,
      };
      setAccessToken(result);
      const expiresAt = new Date(decodedToken.exp * 1000);
      // const maxAge = (expiresAt.getTime() - Date.now()) / 1000;
      graphQLClient.setHeader("Authorization", "Bearer " + token)
      setCookie(undefined, type, JSON.stringify(result), { path: "/", expires: expiresAt });
    } else {
      const result: DecodedRefreshToken = {
        token,
        userId: decodedToken.user_id,
        expiresAt: decodedToken.expire_time,
      };
      setRefreshToken(result);
      const expiresAt = new Date(decodedToken.expire_time * 1000);
      // const maxAge = (expiresAt.getTime() - Date.now()) / 1000;
      setCookie(undefined, type, JSON.stringify(result), { path: "/", expires: expiresAt });
    }

  };

  return <AuthContext.Provider value={{
    bearer: accessToken ? "Bearer " + accessToken.token : undefined,
    accessToken,
    refreshToken,
    isAuthenticated,
    logout,
    receiveToken,
    redirectToLogin,
  }} {...props} />;
}

type UseAuth = {
  bearer?: string;
  isAuthenticated: boolean;
  accessToken?: DecodedAccessToken;
  refreshToken?: DecodedRefreshToken;
  logout(): Promise<void>;
  redirectToLogin(): Promise<void>;
  receiveToken(code: string, incomingState: string): Promise<boolean>;
}

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };
