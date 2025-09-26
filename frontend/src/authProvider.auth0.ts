import { AuthProvider } from "@refinedev/core";
import { Auth0ContextInterface, User } from "@auth0/auth0-react";

type Auth0ContextType = Auth0ContextInterface<User>;

// This will be injected by the Auth0Provider wrapper
let auth0Context: Auth0ContextType;

export const setAuth0Context = (context: Auth0ContextType) => {
  auth0Context = context;
};

const authProvider: AuthProvider = {
  login: async () => {
    // Auth0 handles login through redirect
    if (auth0Context?.loginWithRedirect) {
      await auth0Context.loginWithRedirect({
        appState: {
          returnTo: "/"
        }
      });
    }
    
    return {
      success: true,
      redirectTo: "/",
    };
  },

  logout: async () => {
    if (auth0Context?.logout) {
      auth0Context.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
    
    return {
      success: true,
    };
  },

  check: async () => {
    if (!auth0Context) {
      return {
        authenticated: false,
        error: {
          message: "Auth0 not initialized",
          name: "AuthenticationError",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    if (auth0Context.isLoading) {
      // Still loading, assume not authenticated for now
      return {
        authenticated: false,
      };
    }

    if (!auth0Context.isAuthenticated) {
      return {
        authenticated: false,
        error: {
          message: "Not authenticated",
          name: "AuthenticationError",
        },
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },

  getIdentity: async () => {
    if (auth0Context?.isAuthenticated && auth0Context.user) {
      return {
        id: auth0Context.user.sub || "",
        name: auth0Context.user.name || auth0Context.user.email || "",
        email: auth0Context.user.email || "",
        avatar: auth0Context.user.picture,
      };
    }
    
    return null;
  },

  getPermissions: async () => {
    if (auth0Context?.user) {
      // Extract custom permissions from Auth0 user metadata
      return (
        auth0Context.user["https://ownerpulse.com/permissions"] || []
      );
    }
    
    return null;
  },

  onError: async (error) => {
    console.error("Auth Error:", error);
    return { error };
  },
};

export default authProvider;
