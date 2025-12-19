"use client";
import { FC, JSX, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assets/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

// Define types for user and auth state
interface UserAvatar {
  url: string;
}

interface User {
  name: string;
  role: string;
  avatar?: UserAvatar;
}

interface AuthState {
  user: User | null;
  token?: string;
}

interface RootState {
  auth: AuthState;
}

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  const isActive = selected === title;
  return (
    <MenuItem
      active={isActive}
      onClick={() => setSelected(title)}
      icon={icon}
      className={`!transition-all !duration-200 !rounded-md !mx-1 !my-0.5 ${
        isActive
          ? "!bg-gradient-to-r !from-[#5b6fe6] !to-[#6870fa] !text-white !shadow-md"
          : "hover:!bg-[#5b6fe615] dark:hover:!bg-[#33415580]"
      }`}
    >
      <Link href={to} className="flex items-center w-full">
        <Typography
          className={`!text-[14px] !font-Poppins ${
            isActive ? "!text-white" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {title}
        </Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  
  // Use the logout mutation from your auth API
  const [logout, { isLoading: logoutLoading }] = useLogOutMutation();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const logoutHandler = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API endpoint
      await logout().unwrap();
      
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      // Show success message
      toast.success("Logged out successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: theme === "dark" ? "#1e293b" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1f2937",
          border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
        },
      });
      
      // Small delay before redirect to show toast
      setTimeout(() => {
        // Redirect to login page
        router.push("/login");
        // Force a full page reload to clear any cached state
        window.location.href = "/login";
      }, 1000);
      
    } catch (error: unknown) {
      console.error("Logout error:", error);
      
      // Even if API fails, try to clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      toast.error(
        "Logged out locally. Please login again.",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#ffffff",
          },
        }
      );
      
      setTimeout(() => {
        router.push("/login");
        window.location.href = "/login";
      }, 1500);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "dark"
              ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%) !important"
              : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important"
          }`,
          borderRight: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
        },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item:hover": { color: "#5b6fe6 !important" },
        "& .pro-menu-item.active": { color: "#ffffff !important" },
        "& .pro-inner-item": { padding: "6px 16px 6px 12px !important" },
        "& .pro-menu-item": {
          color: `${theme !== "dark" ? "#475569" : "#cbd5e1"}`,
        },
        "& .scroll-container": {
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: theme === "dark" ? "#475569" : "#cbd5e1",
            borderRadius: "2px",
          },
        },
      }}
      className="bg-transparent"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "4.5rem" : "16rem",
          transition: "all 0.3s ease",
          zIndex: 50,
        }}
      >
        <Menu iconShape="circle">
          {/* Logo and collapse button */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{ margin: "10px 0 15px 0", padding: "0 10px" }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="8px"
              >
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-r from-[#5b6fe6] to-[#6870fa] rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">E</span>
                  </div>
                  <h3 className="text-[18px] font-Poppins font-bold bg-gradient-to-r from-[#5b6fe6] to-[#6870fa] bg-clip-text text-transparent">
                    ELearning
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="!p-1.5 !bg-gray-100 dark:!bg-slate-800"
                  sx={{ borderRadius: "6px" }}
                >
                  <ArrowBackIosIcon className="text-gray-600 dark:text-gray-300 !w-3 !h-3" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* Scrollable Content */}
          <div
            className="scroll-container"
            style={{
              height: "calc(100vh - 100px)",
              overflowY: "auto",
              overflowX: "hidden",
              paddingBottom: "2rem",
            }}
          >
            {/* Profile section */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box mb="15px" px="12px">
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      className="relative mb-2"
                    >
                      <div className="relative">
                        {/* Modern gradient border with shadow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#5b6fe6] via-[#6870fa] to-[#8b5cf6] rounded-full p-[2px] animate-pulse">
                          <div className="w-full h-full bg-transparent rounded-full"></div>
                        </div>
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5b6fe620] to-[#6870fa20] blur-sm"></div>
                        {/* Main image */}
                        <div className="relative w-[65px] h-[65px] rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg">
                          <Image
                            alt="profile-user"
                            src={user?.avatar?.url || avatarDefault}
                            fill
                            sizes="65px"
                            className="object-cover rounded-full"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        {/* Online status indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                      </div>
                    </Box>
                    <Box textAlign="center">
                      <Typography className="!text-[14px] font-medium text-gray-800 dark:text-white mb-0.5">
                        {user?.name}
                      </Typography>
                      <Typography className="!text-[12px] text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu Items */}
            <Box
              paddingLeft={isCollapsed ? undefined : "6%"}
              sx={{ overflow: "hidden" }}
            >
              <div className="space-y-0.5">
                <Item
                  title="Dashboard"
                  to="/admin"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Data
                  </Typography>
                )}
                <Item
                  title="Users"
                  to="/admin/users"
                  icon={<GroupsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Invoices"
                  to="/admin/invoices"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Content
                  </Typography>
                )}
                <Item
                  title="Create Course"
                  to="/admin/create-course"
                  icon={<VideoCallIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Live Courses"
                  to="/admin/courses"
                  icon={<OndemandVideoIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Customization
                  </Typography>
                )}
                <Item
                  title="Hero"
                  to="/admin/hero"
                  icon={<WebIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="FAQ"
                  to="/faq"
                  icon={<QuizIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Categories"
                  to="/admin/categories"
                  icon={<WysiwygIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Controllers
                  </Typography>
                )}
                <Item
                  title="Manage Team"
                  to="/admin/team"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Analytics
                  </Typography>
                )}
                <Item
                  title="Course Analytics"
                  to="/admin/course-analytics"
                  icon={<BarChartOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Orders Analytics"
                  to="/admin/orders-analytics"
                  icon={<MapOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Users Analytics"
                  to="/admin/user-analytics"
                  icon={<ManageHistoryIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {!isCollapsed && (
                  <Typography className="!text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider block px-4 pt-3 pb-0.5">
                    Extras
                  </Typography>
                )}
                <Item
                  title="Settings"
                  to="/admin/settings"
                  icon={<SettingsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                {/* Logout with loading state */}
                <MenuItem
                  onClick={logoutHandler}
                  icon={!isLoggingOut ? <ExitToAppIcon /> : undefined}
                  className={`!transition-all !duration-200 !rounded-md !mx-1 !my-0.5 !mt-4
                    ${isLoggingOut 
                      ? "!bg-gray-100 dark:!bg-slate-800 cursor-not-allowed !px-4" 
                      : "hover:!bg-red-50 dark:hover:!bg-red-950/20 hover:!text-red-600 cursor-pointer"
                    }`}
                  // Remove disabled prop as MenuItem might not support it
                >
                  <Box display="flex" alignItems="center" justifyContent={isCollapsed ? "center" : "flex-start"} gap={1}>
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        {!isCollapsed && (
                          <Typography className="!text-[14px] !font-Poppins text-red-500">
                            Logging out...
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        <ExitToAppIcon className={isCollapsed ? "ml-0" : ""} />
                        {!isCollapsed && (
                          <Typography className="!text-[14px] !font-Poppins text-red-500">
                            Logout
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </MenuItem>
              </div>
            </Box>
          </div>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;