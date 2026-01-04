'use client';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import avatarIcon from '../../../public/assets/avatar.png';
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from '@/redux/features/user/userApi';
import { styles } from '../../../app/styles/style';
import { UserType } from './Profile';
import { useLazyLoadUserQuery } from '@/redux/features/api/apiSlice';
import toast from 'react-hot-toast';

type Props = {
  avatar: string;
  user: NonNullable<UserType>;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user.name || '');
  const [imgError, setImgError] = useState(false); // Add error state

  // RTK Query Hooks
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
  const [triggerLoadUser] = useLazyLoadUserQuery();

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2 && typeof reader.result === 'string') {
        updateAvatar({ avatar: reader.result });
        setImgError(false); // Reset error on new upload
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isSuccess || success) {
      triggerLoadUser(undefined, true);
    }

    if (error || updateError) {
      console.error(error || updateError);
      toast.error('Something went wrong while updating your profile');
    }

    if (success) {
      toast.success('Profile updated successfully!');
    }
  }, [isSuccess, error, success, updateError, triggerLoadUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== '') {
      await editProfile({ name });
    }
  };

  // Function to get safe avatar URL
  const getSafeAvatar = () => {
    if (imgError || !avatar) {
      return avatarIcon.src;
    }
    return avatar;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar Section */}
      <div className="relative group">
        <div className="relative w-[160px] h-[160px] mx-auto">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37a39a] via-[#4f46e5] to-[#ec4899] bg-[length:400%_400%] animate-gradient-xy p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
          </div>

          {/* Image - FIXED HERE */}
          <div className="absolute inset-1 rounded-full overflow-hidden">
            <Image
              src={getSafeAvatar()}
              alt="avatar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="160px"
              unoptimized={avatar.includes('randomuser.me')} // CRITICAL FIX
              onError={() => setImgError(true)}
              priority={true} // Helps with loading
            />
          </div>

          {/* File Input */}
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/*"
          />

          {/* Camera Button */}
          <label htmlFor="avatar" className="absolute -bottom-1 -right-1 cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-r from-[#37a39a] to-[#4f46e5] rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900 transform hover:scale-110 transition-all duration-300">
              <AiOutlineCamera size={18} className="text-white" />
            </div>
          </label>
        </div>
      </div>

      {/* Form Section - unchanged */}
      <div className="w-full mt-8 max-w-md p-6 bg-white/20 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              className={`${styles.input} w-full bg-white/30 dark:bg-slate-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#37a39a] focus:border-transparent transition-all duration-300`}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
              Email Address
            </label>
            <input
              type="text"
              readOnly
              className={`${styles.input} w-full bg-white/30 dark:bg-slate-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white placeholder-gray-500 cursor-not-allowed`}
              value={user.email || ''}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-r from-[#37a39a] to-[#2b7c73] hover:from-[#2b7c73] hover:to-[#37a39a] text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;