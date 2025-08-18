"use client";
import React from 'react';
import Link from 'next/link';
import { Box, Header as GrommetHeader, Nav, Image } from 'grommet';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const Header = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <GrommetHeader background="light-1" pad="small" elevation="small">
      <Box direction="row" align="center" gap="medium" justify="between" width="100%">
        <Link href="/">
          <Image src="/lief-main-logo.svg" alt="Lief Care Clock Logo" width="120px" />
        </Link>
        
        <Nav direction="row" gap="medium">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/care-worker" style={{ textDecoration: 'none', color: 'inherit' }}>
                Care Worker
              </Link>
              <Link href="/manager" style={{ textDecoration: 'none', color: 'inherit' }}>
                Manager
              </Link>
              <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                Profile
              </Link>
            </>
          )}
          {!isLoading && (
            isAuthenticated ? <LogoutButton /> : <LoginButton />
          )}
        </Nav>
      </Box>
    </GrommetHeader>
  );
};

export default Header;