import { parseCookies } from "nookies";

export function getAuthHeaders() {
  const { access_token } = parseCookies();

  const accessToken: any = access_token ? JSON.parse(access_token) : undefined;

  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.authorization = "Bearer " + accessToken.token;
  }

  return headers;
}
