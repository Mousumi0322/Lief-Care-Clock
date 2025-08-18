
import type { Metadata } from "next";
import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import { Grommet } from 'grommet';
import Auth0ProviderWrapper from "../../auth0Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Work_SansFont = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Lief Care Clock",
  description: "A comprehensive care management system",
};




const theme = {
  global: {
    colors: {
      brand: '#58FF79',
      'accent-1': '#009C1D',
      'accent-2': '#e6f7ee',
      'status-ok': '#58FF79',
      'status-critical': '#FF4040',
      'light-1': '#F9F9FF',
      'light-2': '#F5F5F5',
      text: {
        light: '#2d3748',
        dark: '#FFFFFF'
      }
    },
    font: {
      family: 'Work Sans, sans-serif',
    },
    focus: {
      border: {
        color: '#009C1D'
      }
    },
    elevation: {
      light: {
        small: '0 2px 8px rgba(0, 156, 29, 0.15)',
        medium: '0 4px 16px rgba(0, 156, 29, 0.2)',
        large: '0 8px 24px rgba(0, 156, 29, 0.25)'
      }
    }
  },
  button: {
    border: {
      radius: '8px'
    },
    padding: {
      vertical: '10px',
      horizontal: '20px'
    }
  }
}




export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${Work_SansFont.variable}`}>
        <Auth0ProviderWrapper>
          <Grommet theme={theme}>
            {children}
          </Grommet>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
}
