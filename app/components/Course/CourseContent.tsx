// components/Course/CourseContent.tsx - FINAL OPTIMIZED VERSION
"use client";
import React, { useEffect, useState } from "react";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";
import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";


// Types based on your Mongoose schema
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id?: string; // Add this to match API
    url: string;
  };
  isVerified?: boolean; 
}

interface ILink {
  title: string;
  url: string;
}

interface IComment {
  _id?: string;
  user: IUser;
  question: string;
  questionReplies?: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface IReview {
  _id?: string;
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface ICourseData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail?: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface IThumbnail {
  public_id: string;
  url: string;
}

interface ICourse {
  _id: string;
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatePrice?: number;
  thumbnail: IThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  course?: ICourse;
  message?: string;
  success?: boolean;
}

type Props = {
  id: string;
  user: IUser;
};

const CourseContent = ({ id, user }: Props) => {
  const { data, isLoading, error } = useGetCourseContentQuery(id);
  const [activeVideo, setActiveVideo] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ ADD THE DEBUG EFFECT RIGHT HERE - After useState declarations
  useEffect(() => {
    if (data) {
      const apiData = data as ApiResponse;
      console.log("🔍 FULL API RESPONSE:", apiData);
      console.log("📊 Course Structure:", {
        course: apiData.course,
        courseData: apiData.course?.courseData,
        courseDataLength: apiData.course?.courseData?.length,
        courseKeys: apiData.course ? Object.keys(apiData.course) : []
      });
      
      // Check if courseData exists but is empty
      if (apiData.course?.courseData && apiData.course.courseData.length === 0) {
        console.log("⚠️ Course exists but courseData array is EMPTY");
      }
    }
  }, [data]);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile sidebar toggle
  const toggleMobileSidebar = () => {
    const listElement = document.getElementById('course-content-list');
    const overlayElement = document.getElementById('mobile-overlay');
    
    if (listElement && overlayElement) {
      const isHidden = listElement.classList.contains('hidden');
      if (isHidden) {
        listElement.classList.remove('hidden');
        overlayElement.classList.remove('hidden');
      } else {
        listElement.classList.add('hidden');
        overlayElement.classList.add('hidden');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Course Content
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Preparing your learning experience...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-red-900/20 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Please check if you're enrolled in this course.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const apiData = data as ApiResponse | undefined;
  const courseContent = apiData?.course?.courseData || [];

  // Enhanced sample data that matches CourseContentMedia structure
  const sampleCourseContent: ICourseData[] = [
    {
      _id: "1",
      title: "Welcome to the Course",
      description: "Get started with your learning journey. This introduction will guide you through the course structure and what you can expect to achieve.",
      videoUrl: "d3232d187cb64cadbaab54bac84e71dd",
      videoSection: "Introduction",
      videoLength: 420,
      videoPlayer: "normal",
      links: [
        { title: "Course Syllabus", url: "https://example.com/syllabus" },
        { title: "Resources", url: "https://example.com/resources" }
      ],
      suggestion: "Take notes and set learning goals",
      questions: [],
    },
    {
      _id: "2",
      title: "Setting Up Your Environment",
      description: "Learn how to properly set up your development environment with all the necessary tools and configurations for optimal learning.",
      videoUrl: "https://example.com/video2.mp4",
      videoSection: "Setup",
      videoLength: 680,
      videoPlayer: "normal",
      links: [
        { title: "Installation Guide", url: "https://example.com/install" },
        { title: "Tools Download", url: "https://example.com/tools" }
      ],
      suggestion: "Follow each step carefully",
      questions: [],
    },
    {
      _id: "3",
      title: "Core Fundamentals",
      description: "Dive into the fundamental concepts that will form the foundation of your knowledge throughout this course.",
      videoUrl: "https://example.com/video3.mp4",
      videoSection: "Fundamentals",
      videoLength: 540,
      videoPlayer: "normal",
      links: [
        { title: "Practice Exercises", url: "https://example.com/exercises" }
      ],
      suggestion: "Practice regularly to reinforce learning",
      questions: [],
    },
    {
      _id: "4",
      title: "Advanced Techniques",
      description: "Explore advanced techniques and best practices that will take your skills to the next level.",
      videoUrl: "https://example.com/video4.mp4",
      videoSection: "Advanced",
      videoLength: 720,
      videoPlayer: "normal",
      links: [
        { title: "Advanced Resources", url: "https://example.com/advanced" },
        { title: "Case Studies", url: "https://example.com/cases" }
      ],
      suggestion: "Review fundamentals before proceeding",
      questions: [],
    },
    {
      _id: "5",
      title: "Project Implementation",
      description: "Apply everything you've learned by building a complete project from start to finish.",
      videoUrl: "https://example.com/video5.mp4",
      videoSection: "Projects",
      videoLength: 900,
      videoPlayer: "normal",
      links: [
        { title: "Project Files", url: "https://example.com/project" },
        { title: "Documentation", url: "https://example.com/docs" }
      ],
      suggestion: "Code along with the instructor",
      questions: [],
    }
  ];

  const finalCourseContent = courseContent.length > 0 ? courseContent : sampleCourseContent;

  if (finalCourseContent.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/10 py-12 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-purple-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-5xl">📚</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Content Coming Soon
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            We're preparing amazing content for this course!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
      {/* Mobile Sidebar Toggle */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleMobileSidebar}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
          >
            <span className="text-lg">📋</span>
          </button>
        </div>
      )}

      <div className="w-full grid grid-cols-1 1000px:grid-cols-10 gap-6 max-w-7xl mx-auto px-4 py-6">
        {/* Main Content - Matches CourseContentMedia styling */}
        <div className="1000px:col-span-7">
          <CourseContentMedia
            data={finalCourseContent}
            id={id}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            user={user}
          />
        </div>

        {/* Sidebar - Hidden on mobile by default */}
        <div 
          id="course-content-list"
          className="1000px:col-span-3 fixed 1000px:relative inset-y-0 right-0 w-80 1000px:w-full bg-white dark:bg-gray-800 shadow-2xl 1000px:shadow-lg z-40 transform transition-transform duration-300 hidden 1000px:block border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
        >
          {/* Mobile close button */}
          {isMobile && (
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={toggleMobileSidebar}
                className="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className={isMobile ? "h-full overflow-y-auto pb-20 pt-16" : "h-[calc(100vh-120px)] overflow-y-auto"}>
            <CourseContentList
              data={finalCourseContent}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
            />
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && (
          <div 
            id="mobile-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 z-30 hidden"
            onClick={toggleMobileSidebar}
          ></div>
        )}
      </div>

      {/* Mobile Bottom Navigation - Matches CourseContentMedia button styling */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-40 shadow-2xl">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <button
              onClick={() => setActiveVideo(prev => Math.max(0, prev - 1))}
              disabled={activeVideo === 0}
              className={`group flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeVideo === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <span className="text-lg">←</span>
              <span className="text-sm">Prev</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {activeVideo + 1} / {finalCourseContent.length}
              </span>
            </div>

            <button
              onClick={() => setActiveVideo(prev => Math.min(finalCourseContent.length - 1, prev + 1))}
              disabled={activeVideo === finalCourseContent.length - 1}
              className={`group flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeVideo === finalCourseContent.length - 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              <span className="text-sm">Next</span>
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContent;