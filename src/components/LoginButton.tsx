"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "grommet";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      primary
      color="accent-1"
      label="Log In"
      onClick={() => loginWithRedirect()}
    />
  );
}