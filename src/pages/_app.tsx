import { AuthProvider } from "@/app/lib/use_auth";
import { AuthUserProvider } from "@/app/lib/use_auth_user";
import { SocketProvider } from "@/app/lib/use_socket";
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthUserProvider>
        <SocketProvider>
          <Component {...pageProps} />
        </SocketProvider>
      </AuthUserProvider>
    </AuthProvider>
  );
}
