"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Text } from "grommet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthenticationGuard from "./AuthenticationGuard";

// Define the roles
export type UserRole = "manager" | "care-worker";

export default function RoleGuard({ 
  children,
  allowedRole
}: { 
  children: React.ReactNode;
  allowedRole: UserRole;
}) {
  const { user } = useAuth0();
  const router = useRouter();

  // Get user role from local storage or default to care-worker
  const getUserRole = (): UserRole => {
    if (!user) return "care-worker"; // Default role if not logged in
    
    // Check if the user has a stored role preference in localStorage
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem(`userRole_${user.email}`);
      if (storedRole === "manager" || storedRole === "care-worker") {
        return storedRole as UserRole;
      }
    }
    
    // If no stored preference, default to care-worker
    return "care-worker";
  };

  const userRole = getUserRole();
  
  useEffect(() => {
    // If user doesn't have the allowed role, redirect to home
    if (user && userRole !== allowedRole) {
      router.push("/");
    }
  }, [user, userRole, allowedRole, router]);

  return (
    <AuthenticationGuard>
      {userRole === allowedRole ? (
        <>{children}</>
      ) : (
        <Box align="center" justify="center" pad="large">
          <Text>You do not have permission to access this page</Text>
        </Box>
      )}
    </AuthenticationGuard>
  );
}