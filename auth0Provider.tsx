"use client";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  // Handle server-side rendering
  const getRedirectUri = () => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.location.origin;
  };

  return (
    <Auth0Provider
      domain="dev-bgkrn2mbnztxzkzq.us.auth0.com"
      clientId="wTXWZvdgNuUoNteDK56E1PaTFdqHKMRz"
      authorizationParams={{
        redirect_uri: getRedirectUri(),
      }}
    >
      {children}
    </Auth0Provider>
  );
}