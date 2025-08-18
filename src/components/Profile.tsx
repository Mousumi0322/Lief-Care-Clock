"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Text, Spinner, Avatar } from "grommet";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box align="center" justify="center" pad="medium">
        <Spinner />
        <Text margin={{ top: "small" }}>Loading user information...</Text>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Box align="center" justify="center" pad="medium">
        <Text>Please log in to view your profile</Text>
      </Box>
    );
  }

  return (
    <Box align="center" justify="center" pad="medium">
      <Avatar src={user.picture} size="large" />
      <Text weight="bold" size="large" margin={{ top: "small" }}>
        {user.name}
      </Text>
      <Text>{user.email}</Text>
    </Box>
  );
}