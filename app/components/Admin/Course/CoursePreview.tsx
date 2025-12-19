'use client';
import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

// Define types for course data
interface CourseBenefit {
  title: string;
}

interface CoursePrerequisite {
  title: string;
}

interface CourseData {
  name?: string;
  description?: string;
  price?: number;
  estimatedPrice?: number;
  demoUrl?: string;
  benefits?: CourseBenefit[];
  prerequisites?: CoursePrerequisite[];
}

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: CourseData;
  handleCourseCreate: () => Promise<void> | void;
  isEdit?: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit
}) => {
  const discountPercentage =
    ((Number(courseData?.estimatedPrice) - Number(courseData?.price)) /
      Number(courseData?.estimatedPrice)) *
    100;
  const discountPercentagePrice = isNaN(discountPercentage)
    ? 0
    : discountPercentage.toFixed(0);

  const prevButton = () => setActive(active - 1);
  const createCourse = async () => await handleCourseCreate();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg backdrop-blur-lg transition-colors duration-300">
      
      {/* Video Section */}
      <div className="w-full relative rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
        <CoursePlayer videoUrl={courseData?.demoUrl || ""} title={courseData?.name || ""} />
      </div>

      {/* Price Section */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          {courseData?.price === 0 ? "Free" : `$${courseData?.price}`}
        </h1>
        <h5 className="text-lg line-through text-gray-500 dark:text-gray-400">
          ${courseData?.estimatedPrice}
        </h5>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-full text-sm font-medium">
          {discountPercentagePrice}% off
        </span>
      </div>

      {/* Discount Input */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-5">
        <input
          type="text"
          placeholder="Enter discount code..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
        />
        <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:scale-105 active:scale-95 transition-transform w-full sm:w-auto">
          Apply
        </button>
      </div>

      {/* Features */}
      <div className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
        <p>• Source code included</p>
        <p>• Full lifetime access</p>
        <p>• Certificate of completion</p>
        <p>• Premium support</p>
      </div>

      {/* Course Info */}
      <div className="mt-10 space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {courseData?.name}
        </h1>
        <div className="flex items-center flex-wrap gap-4">
          <Ratings rating={0} />
          <h5 className="text-gray-500 dark:text-gray-400">0 Reviews</h5>
          <h5 className="text-gray-500 dark:text-gray-400">0 Students</h5>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          What you will learn from this course?
        </h2>
        <div className="max-h-64 overflow-auto flex flex-col gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
          {courseData?.benefits?.map((item: CourseBenefit, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/50 break-words"
            >
              <IoCheckmarkDoneOutline size={22} className="text-green-500 shrink-0" />
              <p className="text-gray-800 dark:text-gray-200">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Prerequisites
        </h2>
        <div className="max-h-64 overflow-auto flex flex-col gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
          {courseData?.prerequisites?.map((item: CoursePrerequisite, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/50 break-words"
            >
              <IoCheckmarkDoneOutline size={22} className="text-blue-500 shrink-0" />
              <p className="text-gray-800 dark:text-gray-200">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Course Details
        </h2>
        <div className="max-h-80 overflow-auto p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 break-words">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed break-words">
            {courseData?.description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
        <button
          onClick={prevButton}
          className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ← Previous
        </button>
        <button
          onClick={createCourse}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 shadow-md transition"
        >
          {isEdit ? "Update Course" : "Create Course"}
        </button>
      </div>
    </div>
  );
};

export default CoursePreview;