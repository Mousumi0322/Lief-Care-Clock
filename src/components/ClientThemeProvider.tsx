"use client";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../app/globals.jsx";
import { ReactNode } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
  theme: Record<string, unknown>;
}

export default function ClientThemeProvider({ children, theme }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
