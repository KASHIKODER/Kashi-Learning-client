'use client';
import React, { FC, useState, useRef, useEffect, FormEvent, DragEvent, ChangeEvent } from 'react';
import { styles } from '@/app/styles/style';
import { MdCloudUpload } from 'react-icons/md';

// Define CourseInfo type
interface CourseInfo {
  name?: string;
  description?: string;
  price?: string | number;
  estimatedPrice?: string | number;
  tags?: string;
  level?: string;
  demoUrl?: string;
  thumbnail?: string;
}

type Props = {
  courseInfo: CourseInfo;
  setCourseInfo: (courseInfo: CourseInfo) => void;
  active: number;
  setActive: (active: number) => void;
};

// VALID LEVELS BASED ON YOUR BACKEND ENUM
// Your backend only accepts these exact values (case-sensitive):
// 'Beginner', 'Intermediate', 'Advanced'
const VALID_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  // 'Expert' is NOT allowed by your backend schema
];

const CourseInformation: FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Validate that a level is selected
    if (!courseInfo.level) {
      alert('Please select a course level');
      return;
    }
    setActive(active + 1);
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop thumbnail
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [courseInfo?.description]);

  return (
    <div className="w-full -mt-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8 text-center">
        🧠 Course Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8 pb-8">
        {/* Course Name */}
        <div>
          <label className={styles.label}>Course Name</label>
          <input
            type="text"
            required
            value={courseInfo?.name || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            placeholder="MERN Stack LMS Platform with Next.js 13"
            className={`${styles.input} focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Description */}
        <div>
          <label className={styles.label}>Course Description</label>
          <textarea
            ref={textareaRef}
            placeholder="Write a detailed description about your course..."
            className={`${styles.input} resize-none overflow-hidden focus:ring-2 focus:ring-blue-500`}
            value={courseInfo?.description || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          />
        </div>

        {/* Price + Estimated Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={styles.label}>Course Price</label>
            <input
              type="number"
              required
              value={courseInfo?.price || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              placeholder="29"
              className={`${styles.input}`}
              min="0"
            />
          </div>

          <div>
            <label className={styles.label}>Estimated Price (optional)</label>
            <input
              type="number"
              value={courseInfo?.estimatedPrice || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({
                  ...courseInfo,
                  estimatedPrice: e.target.value,
                })
              }
              placeholder="79"
              className={`${styles.input}`}
              min="0"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className={styles.label}>Course Tags</label>
          <input
            type="text"
            required
            value={courseInfo?.tags || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            placeholder="MERN, Next.js 13, TailwindCSS"
            className={`${styles.input}`}
          />
        </div>

        {/* Level + Demo URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`${styles.label} text-gray-700 dark:text-gray-200 font-medium`}>
              Course Level*
            </label>
            <select
              required
              value={courseInfo?.level || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 
      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
      focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 
      focus:outline-none transition-all duration-200 cursor-pointer
      hover:border-gray-400 dark:hover:border-gray-500
      shadow-sm hover:shadow-md"
            >
              <option
                value=""
                disabled
                className="text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 py-2"
              >
                🎯 Select a level
              </option>
              {VALID_LEVELS.map((level) => (
                <option
                  key={level.value}
                  value={level.value}
                  className="py-2 px-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 
          text-gray-800 dark:text-gray-200 transition-colors"
                >
                  {level.value === 'Beginner' }
                  {level.value === 'Intermediate'}
                  {level.value === 'Advanced' }
                  {level.label}
                </option>
              ))}
            </select>

            {/* Helper text with better styling */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 
      dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-1.5 rounded-lg border 
      border-blue-100 dark:border-blue-800/30">
                <span className="text-blue-600 dark:text-blue-400 font-medium">📊</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Choose from:
                  <span className="ml-1.5 font-medium text-gray-800 dark:text-gray-100">
                    Beginner, Intermediate, Advanced
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className={styles.label}>Demo URL</label>
            <input
              type="text"
              required
              value={courseInfo?.demoUrl || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              placeholder="https://example.com/demo"
              className={`${styles.input}`}
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="pt-4">
          <label className={styles.label}>Course Thumbnail*</label>
          <input
            type="file"
            accept="image/*"
            id="thumbnailFile"
            className="hidden"
            onChange={handleFileChange}
            required={!courseInfo?.thumbnail}
          />

          <label
            htmlFor="thumbnailFile"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
              ${dragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-300 dark:border-gray-600'
              }`}
          >
            {courseInfo?.thumbnail ? (
              <div className="relative">
                <img
                  src={courseInfo.thumbnail}
                  alt="Course Thumbnail"
                  className="w-full h-auto max-h-64 object-contain rounded-xl"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white bg-black/50 px-3 py-1 rounded-lg">
                    Click to change
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <MdCloudUpload className="text-4xl text-gray-500 dark:text-gray-300" />
                <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base text-center">
                  Drag & drop your course thumbnail or{' '}
                  <span className="text-blue-500 font-medium">
                    click to browse
                  </span>
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Required: JPEG, PNG, or WebP (max 5MB)
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="w-full md:w-[180px] py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!courseInfo.thumbnail || !courseInfo.level}
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;