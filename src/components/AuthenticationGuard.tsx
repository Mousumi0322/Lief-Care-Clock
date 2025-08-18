"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Spinner, Text } from "grommet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticationGuard({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Box align="center" justify="center" pad="large">
        <Spinner size="medium" />
        <Text margin={{ top: "medium" }}>Loading authentication status...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box align="center" justify="center" pad="large">
        <Text>Please log in to access this page</Text>
      </Box>
    );
  }

  return <>{children}</>;
}