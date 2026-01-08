'use client';
import Image from 'next/image';
import { FC, useState, useRef, useEffect } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import avatarIcon from '../../../public/assets/avatar.png';
import { styles } from '../../../app/styles/style';
import { UserType } from './Profile';
import toast from 'react-hot-toast';
import { useUpdateAvatarMutation, useEditProfileMutation } from '@/redux/features/user/userApi';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/redux/features/auth/authSlice';

type Props = {
  avatar: string;
  user: NonNullable<UserType>;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user.name || '');
  const [imgError, setImgError] = useState(false); // ✅ Fix: useState returns [value, setter]
  const [uploading, setUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  // ✅ Use your existing mutations
  const [updateAvatar] = useUpdateAvatarMutation();
  const [editProfile] = useEditProfileMutation();

  // ✅ Initialize on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tempAvatar = sessionStorage.getItem('temp_avatar');
      if (tempAvatar) {
        setCurrentAvatar(tempAvatar);
        return;
      }
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.avatar && parsedUser.avatar !== avatar) {
            setCurrentAvatar(parsedUser.avatar);
          }
        } catch {
          // Ignore
        }
      }
    }
  }, [avatar]);

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setImgError(false); // ✅ Fix: Use the setter function
    
    const reader = new FileReader();
    
    reader.onload = async () => {
      if (reader.readyState === 2 && typeof reader.result === 'string') {
        const imageData = reader.result;
        
        try {
          // ✅ 1. Update UI immediately
          setCurrentAvatar(imageData);
          
          // ✅ 2. Update Redux store immediately
          dispatch(updateUser({ 
            avatar: imageData,
          }));
          
          // ✅ 3. Update localStorage
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.avatar = imageData;
              localStorage.setItem('user', JSON.stringify(parsedUser));
              sessionStorage.setItem('temp_avatar', imageData);
            }
          }
          
          // ✅ 4. Send to server using your existing mutation
          try {
            const result = await updateAvatar({ avatar: imageData }).unwrap();
            
            if (result.success) {
              toast.success('Avatar updated successfully!');
              
              // Update Redux with server response if available
              if (result.user) {
                const serverAvatar = result.user.avatar?.url || imageData;
                dispatch(updateUser({
                  avatar: serverAvatar,
                  name: result.user.name || user.name
                }));
                setCurrentAvatar(serverAvatar);
              }
            } else {
              toast.error(result.message || 'Failed to update avatar');
            }
          } catch (error: any) {
            console.error('Avatar update error:', error);
            toast.error(error?.data?.message || 'Avatar update failed');
          }
          
        } catch (error: any) {
          toast.error(error.message || 'Failed to update avatar');
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== '' && name !== user.name) {
      setUploading(true);
      try {
        // ✅ 1. Update Redux store immediately
        dispatch(updateUser({ 
          name: name,
        }));
        
        // ✅ 2. Update localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            parsedUser.name = name;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
        }
        
        // ✅ 3. Send to server using your existing mutation
        const result = await editProfile({ name }).unwrap();
        
        if (result.success) {
          toast.success('Profile updated successfully!');
          
          // Update Redux with server response if available
          if (result.user) {
            const updatedAvatar = result.user.avatar?.url || currentAvatar;
            dispatch(updateUser({
              name: result.user.name || name,
              avatar: updatedAvatar
            }));
            setCurrentAvatar(updatedAvatar);
          }
          
          // Also update localStorage with fresh data
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.name = name;
              if (result.user?.avatar?.url) {
                parsedUser.avatar = result.user.avatar.url;
                setCurrentAvatar(result.user.avatar.url);
              }
              localStorage.setItem('user', JSON.stringify(parsedUser));
            }
          }
        } else {
          toast.error(result.message || 'Failed to update profile');
        }
        
      } catch (error: any) {
        console.error('Profile update error:', error);
        toast.error(error?.data?.message || 'Failed to update profile');
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('Please enter a different name');
    }
  };

  const getSafeAvatar = () => {
    return currentAvatar || avatarIcon.src;
  };

  const displayAvatar = getSafeAvatar();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar Section */}
      <div className="relative group">
        <div className="relative w-[160px] h-[160px] mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37a39a] via-[#4f46e5] to-[#ec4899] bg-[length:400%_400%] animate-gradient-xy p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
          </div>

          <div className="absolute inset-1 rounded-full overflow-hidden">
            <Image
              src={displayAvatar}
              alt="avatar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="160px"
              unoptimized={true}
              onError={() => setImgError(true)} // ✅ Fix: Use setter function
              priority={true}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <input
            type="file"
            id="avatar"
            className="hidden"
            ref={fileInputRef}
            onChange={imageHandler}
            accept="image/*"
            disabled={uploading}
          />

          <label htmlFor="avatar" className="absolute -bottom-1 -right-1 cursor-pointer">
            <div className={`w-11 h-11 bg-gradient-to-r from-[#37a39a] to-[#4f46e5] rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900 transform hover:scale-110 transition-all duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <AiOutlineCamera size={18} className="text-white" />
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Form Section */}
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
            className="w-full py-2 mt-2 bg-gradient-to-r from-[#37a39a] to-[#2b7c73] hover:from-[#2b7c73] hover:to-[#37a39a] text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading || name === user.name || name.trim() === ''}
          >
            {uploading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;