import { getAuthHeaders } from "@/app/lib/utils/auth_headers";

export const httpClient = async (url: string, { body, ...customConfig }: RequestInit = {}) => {
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      "content-type": "application/json",
      ...getAuthHeaders(),
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  if (!isValidUrl(url)) {
    url = `${process.env.API_URL}${url}`;
  }
  const response = await fetch(url, config);
  return await response.json();
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
