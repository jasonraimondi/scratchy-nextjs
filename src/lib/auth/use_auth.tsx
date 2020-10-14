import { base64urlencode } from "@/app/lib/base64";
import client from "@/app/lib/client";
import crypto from "crypto";
import { decode } from "jsonwebtoken";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import querystring from "querystring";
import { createContext, useContext, useMemo, useState } from "react";

type DecodedJWT = {
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  cid: string;
  scope: string;
}

type DecodedToken = {
  token: string;
  expiresAt: number;
  userId: string;
}

const clientId = process.env.NEXT_PUBLIC_API_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_API_URL_REDIRECT;

// @ts-ignore
const AuthContext = createContext<UseAuth>();

function AuthProvider(props: any) {
  const router = useRouter();
  const cookies = useMemo(() => parseCookies(), []);
  const [accessToken, setAccessToken] = useState<DecodedToken | undefined>(cookies.access_token ? JSON.parse(cookies.access_token) : undefined);
  const [refreshToken, setRefreshToken] = useState<DecodedToken | undefined>(cookies.refresh_token ? JSON.parse(cookies.refresh_token) : undefined);
  const isAuthenticated = useMemo(() => isAccessTokenValid(accessToken), [accessToken])

  const redirectToLogin = async () => {
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
    };
    setCookie(undefined, "code_verifier", codeVerifier, { path: "/", maxAge: 60 * 10 });
    setCookie(undefined, "code_challenge", codeChallenge, { path: "/", maxAge: 60 * 10 });
    setCookie(undefined, "state", state, { path: "/", maxAge: 60 * 10 });
    const redirectTo = process.env.NEXT_PUBLIC_API_URL_LOGIN + "?" + querystring.stringify(redirectQuery);
    await router.replace(redirectTo);
  };

  const logout = async () => {
    destroyCookie(undefined, "code_verifier");
    destroyCookie(undefined, "code_challenge");
    destroyCookie(undefined, "state");
    destroyCookie(undefined, "access_token");
    destroyCookie(undefined, "refresh_token");
    setAccessToken(undefined);
    setRefreshToken(undefined);
    await router.replace("/");
  };

  const receiveToken = async (code: string, incomingState: string): Promise<boolean> => {
    const codeVerifier = cookies.code_verifier;
    const existingState = cookies.state;

    console.log({ codeVerifier, existingState, incomingState })

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

    const response = await client(process.env.NEXT_PUBLIC_API_URL_TOKEN!, { body });

    if (response.message) {
      console.error(response.message);
      return false;
    }

    if (response.access_token) setTokenCookie(response.access_token, "access_token");
    if (response.refresh_token) setTokenCookie(response.refresh_token, "refresh_token");

    destroyCookie(undefined, "code_verifier");
    destroyCookie(undefined, "code_challenge");
    destroyCookie(undefined, "state");
    return true;
  };

  const setTokenCookie = (token: string, type: "refresh_token"|"access_token") => {
    const decodedToken: DecodedJWT | any = decode(token);

    let result: DecodedToken;
    let maxAge: number;

    if (type === "access_token") {
      result = {
        token,
        userId: decodedToken.sub,
        expiresAt: decodedToken.exp,
      };
      setAccessToken(result);
      const expiresAt = new Date(decodedToken.exp * 1000);
      maxAge = (expiresAt.getTime() - Date.now()) / 1000;
    } else {
      result = {
        token,
        userId: decodedToken.user_id,
        expiresAt: decodedToken.expire_time,
      };
      setRefreshToken(result);
      const expiresAt = new Date(decodedToken.expire_time * 1000);
      maxAge = (expiresAt.getTime() - Date.now()) / 1000;
    }

    setCookie(undefined, type, JSON.stringify(result), { path: "/", maxAge });
  };

  return <AuthContext.Provider value={{
    bearer: accessToken ? "Bearer " + accessToken.token : undefined,
    accessToken,
    refreshToken,
    isAuthenticated,
    logout,
    receiveToken,
    redirectToLogin,
  }} {...props} />
}

type UseAuth = {
  bearer?: string;
  isAuthenticated: boolean;
  accessToken?: DecodedToken;
  refreshToken?: DecodedToken;
  logout(): Promise<void>;
  redirectToLogin(): Promise<void>;
  receiveToken(code: string, incomingState: string): Promise<boolean>;
}

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };

const isAccessTokenValid = (accessToken?: DecodedToken) => {
  return !(Date.now() / 1000 > (accessToken?.expiresAt ?? 0))
};
