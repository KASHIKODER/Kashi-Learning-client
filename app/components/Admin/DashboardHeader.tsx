"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { IoMdNotificationsOutline } from "react-icons/io";

// Remove socket.io import and initialization from here
// const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
// const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

// Define proper TypeScript interfaces
interface Notification {
  _id: string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

interface DashboardHeaderProps {
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

// Date formatter function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DashboardHeader: FC<DashboardHeaderProps> = ({ open, setOpen }) => {
  const { data, refetch } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Create audio instance with error handling
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioInstance = new Audio(
      "https://www.myinstants.com/media/sounds/notification-sound-7062.mp3"
    );
    setAudio(audioInstance);
    
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.src = "";
      }
    };
  }, []);

  const playNotificationSound = () => {
    if (audio) {
      audio.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    }
  };

  // Load notifications
  useEffect(() => {
    if (data) {
      const response = data as NotificationsResponse;
      const unreadNotifications = response.notifications?.filter(
        (item: Notification) => item.status === "unread"
      ) || [];
      setNotifications(unreadNotifications);
    }
    if (isSuccess) {
      refetch();
    }
  }, [data, isSuccess, refetch]);

  // ✅ FIXED: Remove socket.io connection or make it conditional
  // Only connect if not on Vercel
  useEffect(() => {
    // Don't initialize socket on Vercel
    if (typeof window !== 'undefined' && 
        window.location.hostname.includes('vercel.app')) {
      return; // Skip socket initialization on Vercel
    }

    // Only import and use socket.io if needed
    const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
    
    if (!ENDPOINT) {
      console.warn("Socket server URI not configured");
      return;
    }

    // Dynamic import to avoid SSR issues
    import("socket.io-client").then((module) => {
      const socketIO = module.default;
      const socketId = socketIO(ENDPOINT, { 
        transports: ["polling"], // Use polling instead of websocket
        upgrade: false // Disable websocket upgrade
      });

      const handleNewNotification = () => {
        refetch();
        playNotificationSound();
      };

      socketId.on("newNotification", handleNewNotification);

      return () => {
        socketId.off("newNotification", handleNewNotification);
        socketId.disconnect();
      };
    }).catch((error) => {
      console.warn("Socket.io not available:", error);
    });
  }, [refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    try {
      await updateNotificationStatus(id);
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpen?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-4">
      {/* Theme Switcher */}
      <ThemeSwitcher />

      {/* Notification Bell */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setOpen?.(!open)}
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1e293b] transition"
          aria-label="Notifications"
        >
          <IoMdNotificationsOutline className="text-3xl text-black dark:text-white" />
          <span className="absolute -top-1 -right-1 bg-[#3ccba0] rounded-full w-[18px] h-[18px] text-[11px] flex items-center justify-center text-white font-medium shadow">
            {notifications.length}
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-[350px] max-h-[50vh] overflow-y-auto dark:bg-[#111C43] bg-white shadow-xl rounded-lg border border-gray-200 dark:border-[#ffffff1a] animate-fadeIn">
            <h5 className="text-center text-[18px] font-Poppins text-black dark:text-white py-3 border-b border-gray-300 dark:border-[#ffffff26] sticky top-0 bg-white dark:bg-[#111C43] z-10">
              Notifications
            </h5>

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              notifications.map((item: Notification) => (
                <div
                  key={item._id}
                  className="dark:bg-[#2d3a4e30] bg-[#00000008] font-Poppins border-b dark:border-[#ffffff26] border-gray-200 hover:bg-[#3ccba008] dark:hover:bg-[#2d3a4e80] transition"
                >
                  <div className="w-full flex items-center justify-between p-2">
                    <p className="text-black dark:text-white font-medium">
                      {item.title}
                    </p>
                    <button
                      className="text-[#3ccba0] text-[14px] cursor-pointer hover:underline bg-transparent border-none focus:outline-none"
                      onClick={() => handleNotificationStatusChange(item._id)}
                    >
                      Mark as read
                    </button>
                  </div>

                  <p className="px-2 text-[14px] text-black dark:text-gray-300 leading-relaxed">
                    {item.message}
                  </p>

                  <p className="p-2 text-[13px] text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;