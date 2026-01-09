'use client';
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { FC, useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import Script from "next/script";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${poppins.variable} ${josefin.variable}`}>
        <Providers>
          <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>{children}</Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </NextThemesProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Set isClient to true when component mounts (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for token only on client side
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token');
      setHasToken(!!token);
    }
  }, [isClient]);

  // Use the query only on client side and if token exists
  const { isLoading, error, data } = useLoadUserQuery(undefined, {
    skip: !isClient || !hasToken,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Handle loader and errors
  useEffect(() => {
    if (error) {
      console.error('Error loading user:', error);
      // Clear invalid token if 401 error
      if ('status' in error && error.status === 401) {
        localStorage.removeItem('token');
        setHasToken(false);
      }
      setShowLoader(false);
    } else if (isClient && hasToken && isLoading) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [isLoading, hasToken, isClient, error]);

  // Don't render anything until we know if we're on client side
  if (!isClient) {
    return <Loader />; // Show loader during SSR
  }

  return <>{showLoader ? <Loader /> : children}</>;
};