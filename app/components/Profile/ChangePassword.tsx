'use client';
import React, { FC, useEffect, useState } from 'react';
import { styles } from '@/app/styles/style';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';

type Props = object;

const ChangePassword: FC<Props> = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword , {isSuccess,error}] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
    }else{
        await updatePassword({oldPassword , newPassword});
    }
  };

  useEffect(() => {
  if (isSuccess) {
    toast.success("Password changed successfully!");
  }

  if (error) {
    // Check if it's a FetchBaseQueryError
    if ('data' in error && error.data) {
      const errData = error.data as { message?: string };
      toast.error(errData?.message || "Something went wrong");
    } 
    // Check if it's a SerializedError
    else if ('message' in error && typeof error.message === 'string') {
      toast.error(error.message);
    } 
    // Fallback
    else {
      toast.error("Something went wrong");
    }
  }
}, [isSuccess, error]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center px-3 sm:px-5"
    >
      <h1 className="text-[25px] sm:text-[30px] font-Poppins font-[500] text-black dark:text-white mb-4">
        Change Password
      </h1>

      <form
        onSubmit={passwordChangeHandler}
        className="w-full max-w-md bg-white/30 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-md p-6 flex flex-col gap-5 border border-gray-200 dark:border-gray-700"
      >
        {/* Old Password */}
        <div>
          <label className="block pb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            Current Password
          </label>
          <input
            type="password"
            className={`${styles.input} w-full bg-white/60 dark:bg-slate-700/50 text-black dark:text-white placeholder-gray-500 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#37a39a] focus:outline-none transition-all duration-300`}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block pb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            New Password
          </label>
          <input
            type="password"
            className={`${styles.input} w-full bg-white/60 dark:bg-slate-700/50 text-black dark:text-white placeholder-gray-500 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#37a39a] focus:outline-none transition-all duration-300`}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block pb-1 text-sm font-medium text-gray-800 dark:text-gray-200">
            Confirm New Password
          </label>
          <input
            type="password"
            className={`${styles.input} w-full bg-white/60 dark:bg-slate-700/50 text-black dark:text-white placeholder-gray-500 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-[#37a39a] focus:outline-none transition-all duration-300`}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-2 mt-2 bg-gradient-to-r from-[#37a39a] to-[#2b7c73] hover:from-[#2b7c73] hover:to-[#37a39a] text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          Update Password
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChangePassword;
 