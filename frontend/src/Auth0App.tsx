import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ReactNode, useEffect } from "react";
import { setAuth0Context } from "./authProvider.auth0";
import { setTokenProvider } from "./dataProvider.custom";

interface Auth0AppProps {
  children: ReactNode;
}

const Auth0AppInner = ({ children }: Auth0AppProps) => {
  const auth0 = useAuth0();

  useEffect(() => {
    // Set the Auth0 context for the auth provider
    setAuth0Context(auth0);

    // Set the token provider for the data provider
    setTokenProvider({
      getAccessToken: async () => {
        if (auth0.isAuthenticated) {
          return await auth0.getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            },
          });
        }
        throw new Error("Not authenticated");
      },
    });
  }, [auth0]);

  return <>{children}</>;
};

export const Auth0App = ({ children }: Auth0AppProps) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Configuration Error</h2>
          <p className="text-gray-600">
            Please check your Auth0 environment variables:
          </p>
          <ul className="text-sm text-gray-500 mt-2">
            <li>VITE_AUTH0_DOMAIN: {domain ? "✓" : "✗"}</li>
            <li>VITE_AUTH0_CLIENT_ID: {clientId ? "✓" : "✗"}</li>
            <li>VITE_AUTH0_AUDIENCE: {audience ? "✓" : "✗"}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={false}
    >
      <Auth0AppInner>{children}</Auth0AppInner>
    </Auth0Provider>
  );
};