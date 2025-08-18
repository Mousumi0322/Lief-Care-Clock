"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "grommet";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <Button
      secondary
      color="neutral-3"
      label="Log Out"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    />
  );
}