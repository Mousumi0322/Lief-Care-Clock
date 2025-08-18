'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Text, Card, CardBody, CardHeader } from 'grommet';
import RoleSelector from '@/components/RoleSelector';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated and has a stored role
    if (isAuthenticated && user?.email && typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(`userRole_${user.email}`);
      setUserRole(storedRole);
      
      // If user has a stored role, redirect to the appropriate page
      if (storedRole === 'manager') {
        router.push('/manager');
      } else if (storedRole === 'care-worker') {
        router.push('/care-worker');
      } else {
        // If no stored role, show the role selector
        setShowRoleSelector(true);
      }
    }
  }, [isAuthenticated, user, router]);
  
  // Function to reset user role (for testing)
  const resetRole = () => {
    if (user?.email) {
      localStorage.removeItem(`userRole_${user.email}`);
      setUserRole(null);
      setShowRoleSelector(true);
    }
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo and Header */}
        <div className={styles.header}>
          <Image
            src="/lief-main-logo.svg"
            alt="Lief Care Clock Logo"
            width={120}
            height={60}
            className={styles.logo}
          />
          <h1 className={styles.title}>Welcome to Care Clock</h1>
          <p className={styles.subtitle}>
            Your comprehensive care management solution
          </p>
        </div>

        {/* Authentication Status */}
        <div className={styles.roleSelection}>
          {isLoading ? (
            <h2 className={styles.roleTitle}>Loading...</h2>
          ) : isAuthenticated ? (
            showRoleSelector ? (
              // Show role selector if user doesn't have a stored role
              <RoleSelector />
            ) : (
              // Show welcome message and loading indicator while redirecting
              <>
                <h2 className={styles.roleTitle}>Welcome, {user?.name}!</h2>
                <p className={styles.roleDescription}>
                  Redirecting you to your dashboard...
                </p>
                <Box align="center" margin={{ top: 'medium' }}>
                  <Button 
                    secondary 
                    label="Log Out" 
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    margin={{ top: 'medium' }}
                  />
                  {/* For testing: Button to reset role */}
                  <Button 
                    plain
                    label="Reset Role" 
                    onClick={resetRole}
                    margin={{ top: 'small' }}
                    size="small"
                  />
                </Box>
              </>
            )
          ) : (
            <>
              <h2 className={styles.roleTitle}>Welcome to Care Clock</h2>
              <p className={styles.roleDescription}>
                Please log in to access the care management system
              </p>
              
              <Box align="center" margin={{ top: 'medium' }}>
                <Button 
                  primary 
                  size="large" 
                  label="Log In / Sign Up" 
                  onClick={() => loginWithRedirect()} 
                  color="brand"
                />
                <Text size="small" margin={{ top: 'small' }}>
                  Secure authentication powered by Auth0
                </Text>
              </Box>
            </>
          )}
        </div>

        {/* Features Preview */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⏰</div>
            <span>Time Tracking</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <span>Analytics</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👥</div>
            <span>Team Management</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <span>Mobile Friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
