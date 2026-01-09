// app/components/Header.tsx
"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
// REMOVE THIS: import Image from "next/image";
import avatar from "../../public/assets/avatar.png";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useLogOutMutation, useSocialAuthMutation } from "@/redux/features/auth/authApi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const HeaderComponent: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false); // Add this for image error handling

  const { user } = useSelector((state: RootState) => state.auth);
  const { data: sessionData } = useSession();
  const [socialAuth] = useSocialAuthMutation();
  const [logOutMutation] = useLogOutMutation();

  // 🔹 Mounted check to prevent hydration errors
  useEffect(() => setMounted(true), []);

  // 🔹 Social login + session logout
  useEffect(() => {
    if (!mounted) return;

    if (!user && sessionData?.user) {
      socialAuth({
        email: sessionData.user.email ?? "",
        name: sessionData.user.name ?? "",
        avatar: sessionData.user.image ?? "",
      });
    }

    if (sessionData === null && user) {
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData, user, mounted]);

  // 🔹 Header scroll effect
  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "screen") setOpenSidebar(false);
  };

  // 🔹 Logout handler
  const handleLogout = async () => {
    await logOutMutation().unwrap(); 
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-[80]">
      <div
        className={`transition-all duration-500 ${active
            ? "bg-white dark:bg-[#0f172a] shadow-md border-b border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-[#0f172a] border-b border-transparent"
          }`}
      >
        <div className="w-[95%] md:w-[92%] m-auto h-[80px] flex items-center justify-between px-3">
          <Link
            href="/"
            className="text-[28px] font-Poppins font-[700] text-[#1e293b] dark:text-[#f8fafc] tracking-wide"
          >
            Kashi-Learning
          </Link>

          <div className="flex items-center gap-4">
            <NavItems activeItem={activeItem} isMobile={false} />
            <ThemeSwitcher />

            <div className="md:hidden">
              <HiOutlineMenuAlt3
                size={26}
                className="cursor-pointer dark:text-white text-[#1e293b] hover:scale-110 transition-transform"
                onClick={() => setOpenSidebar(true)}
              />
            </div>

            {user ? (
              <Link href="/profile">
                <Image
                  src={imgError ? avatar : (typeof user.avatar === "string" ? user.avatar : user.avatar?.url || avatar)}
                  alt="User Avatar"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full cursor-pointer object-cover"
                  style={{ border: activeItem === 5 ? "2px solid #ffc107" : "none" }}
                  onError={() => setImgError(true)}
                  priority={false}
                />
              </Link>
            ) : (
              <HiOutlineUserCircle
                size={27}
                className="hidden md:block cursor-pointer dark:text-white text-[#1e293b] hover:scale-110 transition-transform"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {openSidebar && (
        <>
          <div
            id="screen"
            className="fixed w-full h-screen top-0 left-0 z-[40] bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="w-[70%] fixed z-[50] h-screen bg-white dark:bg-[#0f172a] top-0 right-0 shadow-2xl transition-all duration-500">
            <NavItems activeItem={activeItem} isMobile={true} />
            <div className="pl-5 mt-3">
              <HiOutlineUserCircle
                size={28}
                className="cursor-pointer text-[#1e293b] dark:text-white hover:scale-110 transition-transform"
                onClick={() => setOpen(true)}
              />
            </div>
            <p className="text-[14px] px-5 mt-8 text-gray-600 dark:text-gray-300">
              © 2025 ELearning. All rights reserved.
            </p>
          </div>
        </>
      )}

      {/* Modals */}
      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login as React.ComponentType<{ setOpen: (open: boolean) => void; setRoute?: (route: string) => void }>}
        />
      )}
      {route === "Signup" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp as React.ComponentType<{ setOpen: (open: boolean) => void; setRoute?: (route: string) => void }>}
        />
      )}
      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification as React.ComponentType<{ setOpen: (open: boolean) => void; setRoute?: (route: string) => void }>}
        />
      )}
    </header>
  );
};

// ✅ Wrap with dynamic to disable SSR
export default dynamic(() => Promise.resolve(HeaderComponent), { ssr: false });