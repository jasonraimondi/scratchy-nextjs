import { COOKIE } from "@/app/lib/cookie_constants";
import cookieService from "@/app/lib/cookie_service";
import { DecodedAccessToken } from "@/app/lib/use_auth";

export function getAuthHeaders() {
  const accessToken = cookieService.get<DecodedAccessToken>(COOKIE.accessToken);
  const headers: Record<string, string> = {};
  if (accessToken) headers.authorization = "Bearer " + accessToken.token;
  return headers;
}
