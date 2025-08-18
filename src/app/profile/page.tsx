"use client";
import { Box, Heading, Card, CardBody, CardHeader, Text } from "grommet";
import Profile from "@/components/Profile";
import AuthenticationGuard from "@/components/AuthenticationGuard";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfilePage() {
  const { user } = useAuth0();

  return (
    <AuthenticationGuard>
      <Box align="center" justify="center" pad="large">
        <Card width="medium" background="light-1" elevation="small">
          <CardHeader pad="medium" background="brand">
            <Heading level={2} margin="none">
              User Profile
            </Heading>
          </CardHeader>
          <CardBody pad="medium">
            <Profile />
            
            {user && (
              <Box margin={{ top: "medium" }}>
                <Heading level={3} size="small">
                  Account Details
                </Heading>
                <Box border={{ color: "light-3", size: "1px" }} pad="small" round="small">
                  <Text weight="bold">User ID:</Text>
                  <Text margin={{ bottom: "small" }}>{user.sub}</Text>
                  
                  <Text weight="bold">Email Verified:</Text>
                  <Text margin={{ bottom: "small" }}>{user.email_verified ? "Yes" : "No"}</Text>
                  
                  <Text weight="bold">Last Updated:</Text>
                  <Text>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</Text>
                </Box>
              </Box>
            )}
          </CardBody>
        </Card>
      </Box>
    </AuthenticationGuard>
  );
}