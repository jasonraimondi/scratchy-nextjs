import { useApiMe } from "@/app/lib/api/me";
import { useAuth } from "@/app/lib/use_auth";
import { createContext, useContext } from "react";

// @ts-ignore
const AuthUserContext = createContext<UseAuth>();

function AuthUserProvider(props: any) {
  const { accessToken } = useAuth();

  const { data } = useApiMe();

  const isAuthenticated = () => !(Date.now() / 1000 > (accessToken?.expiresAt ?? 0));

  return <AuthUserContext.Provider value={{
    user: data?.me,
    isAuthenticated,
  }} {...props} />;
}

type UseAuthUser = {
  user?: any;
  isAuthenticated(): boolean;
}

const useAuthUser = () => useContext<UseAuthUser>(AuthUserContext);

export { AuthUserProvider, useAuthUser };
