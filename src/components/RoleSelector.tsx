"use client";
import { useState } from "react";
import { Box, Button, Card, CardBody, CardHeader, Heading, Text } from "grommet";
import { useAuth0 } from "@auth0/auth0-react";
import { UserRole } from "./RoleGuard";
import { useRouter } from "next/navigation";

export default function RoleSelector() {
  const { user } = useAuth0();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (!selectedRole || !user?.email) return;
    
    // Save the user's role preference to localStorage
    localStorage.setItem(`userRole_${user.email}`, selectedRole);
    
    // Redirect to the appropriate page based on role
    if (selectedRole === "manager") {
      router.push("/manager");
    } else {
      router.push("/care-worker");
    }
  };

  return (
    <Box align="center" justify="center" pad="large">
      <Card width="medium">
        <CardHeader pad="medium" background="brand">
          <Heading level={3} margin="none" color="white">
            Select Your Role
          </Heading>
        </CardHeader>
        <CardBody pad="medium" gap="medium">
          <Text>Please select your role to continue:</Text>
          
          <Box direction="row" gap="medium" justify="center">
            <Button
              primary={selectedRole === "care-worker"}
              color={selectedRole === "care-worker" ? "brand" : "light-3"}
              label="Care Worker"
              onClick={() => handleRoleSelect("care-worker")}
            />
            
            <Button
              primary={selectedRole === "manager"}
              color={selectedRole === "manager" ? "brand" : "light-3"}
              label="Manager"
              onClick={() => handleRoleSelect("manager")}
            />
          </Box>
          
          <Box align="center" margin={{ top: "medium" }}>
            <Button
              primary
              label="Confirm"
              disabled={!selectedRole}
              onClick={handleConfirm}
            />
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}