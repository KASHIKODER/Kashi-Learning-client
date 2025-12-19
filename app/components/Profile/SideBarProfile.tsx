'use client';
import Image from "next/image";
import Link from "next/link";
import React, { FC, ReactNode } from "react";
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
  link?: string; // for Link items like Admin Dashboard
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

  // Build menu dynamically
  const menuItems: MenuItem[] = [
    { id: 1, label: "My Account", icon: avatar || avatarDefault.src },
    { id: 2, label: "Change Password", icon: <RiLockPasswordLine size={22} /> },
    { id: 3, label: "Enrolled Courses", icon: <SiCoursera size={22} /> },
    // Insert Admin Dashboard above Log Out if admin
    ...(isAdmin ? [{ id: 5, label: "Admin Dashboard", icon: <MdDashboard size={22} />, link: "/admin" }] : []),
    { id: 4, label: "Log Out", icon: <AiOutlineLogout size={22} /> },
  ];

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
              <Image
                src={item.icon}
                alt="avatar"
                width={40}
                height={40}
                className="w-[40px] h-[40px] rounded-full object-cover border border-white/20"
              />
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
