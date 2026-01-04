'use client';
import Image from "next/image";
import Link from "next/link";
import React, { FC, ReactNode, useState } from "react"; // Add useState
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import avatarDefault from "../../../public/assets/avatar.png";
import { UserType } from "./Profile"; 

type MenuItem = {
  id: number;
  label: string;
  icon: ReactNode | string;
  link?: string;
};

type Props = {
  user: UserType;
  avatar: string;
  active: number;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logOutHandler }) => {
  const isAdmin = user?.role === "admin";
  const [imgError, setImgError] = useState(false); // Add error state

  // Build menu dynamically
  const menuItems: MenuItem[] = [
    { id: 1, label: "My Account", icon: avatar || avatarDefault.src },
    { id: 2, label: "Change Password", icon: <RiLockPasswordLine size={22} /> },
    { id: 3, label: "Enrolled Courses", icon: <SiCoursera size={22} /> },
    ...(isAdmin ? [{ id: 5, label: "Admin Dashboard", icon: <MdDashboard size={22} />, link: "/admin" }] : []),
    { id: 4, label: "Log Out", icon: <AiOutlineLogout size={22} /> },
  ];

  // Function to get safe avatar URL
  const getSafeAvatar = () => {
    if (imgError || !avatar) {
      return avatarDefault.src;
    }
    return avatar;
  };

  return (
    <div className="w-full h-full flex flex-col items-start py-4">
      {menuItems.map((item) =>
        item.link ? (
          <Link
            key={item.id}
            href={item.link}
            className={`w-full flex items-center px-4 py-4 cursor-pointer rounded-xl transition-all duration-300
              ${active === item.id ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
            onClick={() => setActive(item.id)}
          >
            <div className="text-indigo-400 dark:text-indigo-300">{item.icon}</div>
            <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
              {item.label}
            </h5>
          </Link>
        ) : (
          <div
            key={item.id}
            onClick={() => (item.label === "Log Out" ? logOutHandler() : setActive(item.id))}
            className={`w-full flex items-center gap-3 px-4 py-4 cursor-pointer rounded-xl transition-all duration-300
              ${active === item.id
                ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 dark:bg-slate-800 shadow-md"
                : "hover:bg-white/10 dark:hover:bg-slate-800/60"
              }`}
          >
            {item.id === 1 && typeof item.icon === "string" ? (
              <div className="relative w-[40px] h-[40px]">
                <Image
                  src={getSafeAvatar()}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover border border-white/20"
                  sizes="40px"
                  unoptimized={avatar.includes('randomuser.me')} // CRITICAL FIX
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="text-indigo-400 dark:text-indigo-300">{item.icon}</div>
            )}
            <h5 className="hidden 800px:block font-Poppins font-medium text-gray-800 dark:text-gray-200">
              {item.label}
            </h5>
          </div>
        )
      )}
    </div>
  );
};

export default SideBarProfile;