'use client';
import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import SideBarProfile from './SideBarProfile';
import { signOut } from 'next-auth/react';
import ProfileInfo from './ProfileInfo';
import ChangePassword from "./ChangePassword";

// Shared User Type
export type UserType = {
  name?: string;
  email?: string;
  role?: string; // <-- Added role for admin check
  avatar?: {
    public_id?: string;
    url?: string;
  } | string | null;
} | null;

type Props = {
  user: UserType;
};

const Profile: FC<Props> = ({ user }) => {
  const [active, setActive] = useState(1);

  const avatarUrl =
    typeof user?.avatar === 'string'
      ? user.avatar
      : user?.avatar?.url || '/default-avatar.png';

  const logOutHandler = async () => {
    await signOut();
  };

  return (
    <div className="w-[95%] 800px:w-[85%] flex mx-auto relative mt-[100px] mb-[80px] gap-6">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[100px] 600px:w-[280px] 800px:w-[320px] min-h-[500px]
          bg-gradient-to-br from-white/20 via-blue-50/10 to-transparent
          dark:from-slate-900/60 dark:via-slate-800/50 dark:to-black/40
          backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg
          transition-all duration-500 ease-in-out sticky top-[30px] 800px:top-[120px]"
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatarUrl}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </motion.div>

      {/* Right section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-6 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-transparent
          dark:from-slate-800/40 dark:via-slate-900/50 dark:to-black/40
          rounded-2xl border border-white/10 backdrop-blur-md shadow-lg"
      >
        {active === 1 && user && <ProfileInfo avatar={avatarUrl} user={user} />}
        {active === 2 && <ChangePassword />}
        {active === 3 && <h1 className="text-2xl font-semibold">🎓 Enrolled Courses</h1>}
        {active === 5 && <h1 className="text-2xl font-semibold">📊 Admin Dashboard</h1>}
        {active === 4 && <h1 className="text-2xl font-semibold">👋 Logging Out</h1>}
      </motion.div>
    </div>
  );
};

export default Profile;
