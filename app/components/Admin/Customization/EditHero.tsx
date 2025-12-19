'use client';
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import Image from "next/image";
import React, { FC, useEffect, useState, useRef } from "react";
import { AiOutlineCamera, AiOutlineSave } from "react-icons/ai";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";

// Define types for layout data
interface BannerImage {
  url: string;
}

interface BannerData {
  image: BannerImage;
  title: string;
  subTitle: string;
}

interface LayoutData {
  success: boolean;
  layout: {
    banner: BannerData;
  };
}

const EditHero: FC = () => {
  const [image, setImage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  
  // Refs for textareas
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subTitleRef = useRef<HTMLTextAreaElement>(null);

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading, isSuccess, error }] = useEditLayoutMutation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ----------------------
  // EFFECTS
  // ----------------------
  useEffect(() => {
    if (data && 'success' in data && data.success) {
      const layoutData = data as LayoutData;
      setImage(layoutData?.layout?.banner?.image?.url || "");
      setTitle(layoutData?.layout?.banner?.title || "");
      setSubTitle(layoutData?.layout?.banner?.subTitle || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Hero Section Updated Successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as { data?: { message?: string } };
        toast.error(errorData.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [isSuccess, error, refetch]);

  // ----------------------
  // HANDLERS
  // ----------------------
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (reader.readyState === 2 && event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    try {
      await editLayout({
        type: "Banner",
        image,
        title,
        subTitle,
      }).unwrap();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // Auto-resize textareas - SIMPLIFIED APPROACH
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [title, titleRef.current]); // Include titleRef.current in dependencies

  useEffect(() => {
    if (subTitleRef.current) {
      subTitleRef.current.style.height = 'auto';
      subTitleRef.current.style.height = subTitleRef.current.scrollHeight + 'px';
    }
  }, [subTitle, subTitleRef.current]); // Include subTitleRef.current in dependencies

  // Check if there are changes
  const hasChanges = data && 'layout' in data && data.layout?.banner ? 
    data.layout.banner.title !== title ||
    data.layout.banner.subTitle !== subTitle ||
    data.layout.banner.image?.url !== image
    : !!title || !!subTitle || !!image; // If no data yet, consider any input as a change

  // ----------------------
  // RENDER
  // ----------------------
  return (
    <div
      className={`w-full min-h-screen flex flex-col lg:flex-row items-center justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-y-auto transition-all duration-500 ${
        isDark ? "bg-gradient-to-br from-gray-900 to-black" : "bg-gradient-to-br from-blue-50 to-gray-100"
      }`}
    >
      {/* LEFT SIDE IMAGE - Full cover circular design */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0">
        <div className="relative h-[340px] w-[340px] sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px] rounded-full overflow-hidden hero_banner_animation flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          {image ? (
            <Image
              src={image}
              alt="Banner Image"
              fill
              className="object-cover rounded-full"
              priority
              sizes="(max-width: 768px) 340px, (max-width: 1024px) 400px, 460px"
              style={{ 
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-medium">No Image</span>
            </div>
          )}

          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleUpdate}
            className="hidden"
          />
          <label htmlFor="banner" className="absolute bottom-3 right-3 z-20 cursor-pointer">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-2xl hover:scale-110 transition-transform duration-200">
              <AiOutlineCamera className="text-xl text-black dark:text-white" />
            </div>
          </label>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT - Auto-expanding text areas */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-0 px-4 relative">
        <div className="w-full max-w-2xl">
          {/* Title Input - Auto expanding (Larger text) */}
          <textarea
            ref={titleRef}
            className={`dark:text-white resize-none text-[#000000c7] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold w-full px-4 py-3 rounded-xl transition-all duration-300 border-2 ${
              isDark 
                ? "bg-gray-800 border-gray-700 focus:border-purple-500" 
                : "bg-white border-gray-200 focus:border-blue-500"
            } focus:outline-none focus:ring-4 ${
              isDark ? "focus:ring-purple-500/20" : "focus:ring-blue-500/20"
            } overflow-hidden leading-tight`}
            placeholder="Improve Your Online Learning Experience Better Instantly"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
            rows={1}
            style={{
              minHeight: '120px'
            }}
          />

          {/* Subtitle Input - Auto expanding (Smaller text) */}
          <textarea
            ref={subTitleRef}
            value={subTitle}
            className={`dark:text-white resize-none text-[#000000c7] text-sm sm:text-base md:text-lg w-full px-4 py-3 rounded-xl transition-all duration-300 border-2 mt-6 ${
              isDark 
                ? "bg-gray-800 border-gray-700 focus:border-purple-500" 
                : "bg-white border-gray-200 focus:border-blue-500"
            } focus:outline-none focus:ring-4 ${
              isDark ? "focus:ring-purple-500/20" : "focus:ring-blue-500/20"
            } overflow-hidden leading-relaxed`}
            placeholder="We have 40k+ Online courses & 500k+ Online registered students. Find your desired Courses from them."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSubTitle(e.target.value)}
            rows={1}
            style={{
              minHeight: '80px'
            }}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Change Image Button */}
            <input
              type="file"
              id="banner-mobile"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label 
              htmlFor="banner-mobile" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center flex-1 sm:flex-none text-sm sm:text-base"
            >
              <AiOutlineCamera className="text-xl" />
              Change Image
            </label>

            {/* Save Button */}
            <button
              disabled={!hasChanges || isLoading}
              onClick={hasChanges ? handleEdit : undefined}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform shadow-lg flex-1 sm:flex-none text-sm sm:text-base ${
                hasChanges && !isLoading
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 hover:shadow-xl cursor-pointer"
                  : "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <AiOutlineSave className="text-xl" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHero;