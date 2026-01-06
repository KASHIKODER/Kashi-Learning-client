'use client';
import Image from 'next/image';
import { FC, useState, useRef } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import avatarIcon from '../../../public/assets/avatar.png';
import { styles } from '../../../app/styles/style';
import { UserType } from './Profile';
import toast from 'react-hot-toast';

type Props = {
  avatar: string;
  user: NonNullable<UserType>;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user.name || '');
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setImgError(false);
    
    const reader = new FileReader();
    
    reader.onload = async () => {
      if (reader.readyState === 2 && typeof reader.result === 'string') {
        try {
          // Try server update first
          try {
            const response = await fetch('https://kashi-learning-server.onrender.com/api/v1/update-user-avatar', {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ avatar: reader.result }),
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
              toast.success('Avatar updated successfully!');
              
              // Update localStorage
              if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                  const parsedUser = JSON.parse(storedUser);
                  parsedUser.avatar = result.user?.avatar?.url || reader.result;
                  localStorage.setItem('user', JSON.stringify(parsedUser));
                }
              }
              
              // Reload page to show updated avatar
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              
              return; // Success, exit early
            }
          } catch {
            // Server update failed, fall back to local storage
          }
          
          // Fallback: Update local storage
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.avatar = reader.result;
              localStorage.setItem('user', JSON.stringify(parsedUser));
              sessionStorage.setItem('temp_avatar', reader.result);
            }
          }
          
          toast.success(
            <div>
              <p>Avatar updated locally! 🎉</p>
              <p className="text-sm mt-1">
                Note: Server validation issue. Avatar will be visible to you.
                Refresh page to see changes.
              </p>
            </div>
          );
          
          // Trigger UI update and reload
          setImgError(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
          
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
      try {
        const response = await fetch('https://kashi-learning-server.onrender.com/api/v1/update-user-info', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          toast.success('Profile updated successfully!');
          
          // Update localStorage
          if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              parsedUser.name = name;
              localStorage.setItem('user', JSON.stringify(parsedUser));
            }
          }
          
          // Reload to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(result.message || 'Failed to update profile');
        }
        
      } catch (error: any) {
        toast.error(error.message || 'Failed to update profile');
      }
    }
  };

  // Helper function to check if image should be unoptimized
  const shouldUseUnoptimized = (avatarUrl: string) => {
    return avatarUrl.startsWith('data:image/') || 
           avatarUrl.includes('randomuser.me') ||
           avatarUrl.includes('cloudinary.com');
  };

  // Get avatar with fallback to localStorage
  const getSafeAvatar = () => {
    if (typeof window !== 'undefined') {
      // Check sessionStorage first for immediate updates
      const tempAvatar = sessionStorage.getItem('temp_avatar');
      if (tempAvatar) return tempAvatar;
      
      // Check localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.avatar && parsedUser.avatar !== avatar) {
            return parsedUser.avatar;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
    
    // If we have an external URL that might fail optimization, return it
    if (avatar && (avatar.includes('randomuser.me') || avatar.includes('cloudinary.com'))) {
      return avatar;
    }
    
    if (imgError || !avatar) {
      return avatarIcon.src;
    }
    return avatar;
  };

  const displayAvatar = getSafeAvatar();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar Section */}
      <div className="relative group">
        <div className="relative w-[160px] h-[160px] mx-auto">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37a39a] via-[#4f46e5] to-[#ec4899] bg-[length:400%_400%] animate-gradient-xy p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
          </div>

          {/* Image */}
          <div className="absolute inset-1 rounded-full overflow-hidden">
            <Image
              src={displayAvatar}
              alt="avatar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="160px"
              unoptimized={shouldUseUnoptimized(displayAvatar)}
              onError={() => setImgError(true)}
              priority={true}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            type="file"
            id="avatar"
            className="hidden"
            ref={fileInputRef}
            onChange={imageHandler}
            accept="image/*"
            disabled={uploading}
          />

          {/* Camera Button */}
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