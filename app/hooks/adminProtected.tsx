'use client';

import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"; // ✅ Import the hook

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  // ✅ Get user from Redux (old state)
  const { user } = useSelector((state: RootState) => state.auth);
  
  // ✅ Get FRESH user data from API
  const { data: apiData, isLoading, error, refetch } = useLoadUserQuery({});
  
  // ✅ Refetch on mount to get latest data
  useEffect(() => {
    refetch();
  }, []);

  // ✅ Check loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Checking admin permissions...</p>
      </div>
    );
  }

  // ✅ Determine which user data to use
  const currentUser = apiData?.user || user;
  
  console.log("🔍 Admin Check:", {
    fromAPI: apiData?.user?.role,
    fromRedux: user?.role,
    using: currentUser?.role,
    isAdmin: currentUser?.role === 'admin'
  });

  // ✅ Check if user is admin
  if (currentUser?.role === "admin") {
    return <>{children}</>;
  }

  // ✅ If not admin or no user, redirect
  if (error || !currentUser) {
    console.log("❌ Redirecting - No user or error:", error);
    redirect("/");
    return null;
  }

  console.log("❌ Redirecting - Not an admin. Role:", currentUser?.role);
  redirect("/");
  return null;
}