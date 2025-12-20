// app/course-access/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter, useParams } from "next/navigation";
import Loader from "../../../app/components/Loader/Loader";
import CourseContent from "@/app/components/Course/CourseContent";

// Define proper types based on your API response
interface UserCourse {
  courseId: string;
  // Add other course properties if needed
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  courses?: UserCourse[];
  isVerified?: boolean;
}

interface LoadUserResponse {
  success?: boolean;
  message?: string;
  activationToken: string;
  user: ApiUser;
}

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const { isLoading, error, data } = useLoadUserQuery(undefined);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!id) return;        // wait for id
    if (isLoading) return;

    // Type guard to check if data has the correct structure
    const response = data as LoadUserResponse | undefined;
    if (error || !response?.user) {
      console.log("❌ User not authenticated, redirecting...");
      router.replace("/");
      return;
    }

    const isPurchased =
      response.user.courses?.some((c) => c.courseId === id) ||
      localStorage.getItem(`course_${id}_enrolled`) === "true";

    console.log("🔍 Enrollment Check:", {
      courseId: id,
      userCourses: response.user.courses,
      isPurchased,
      localStorage: localStorage.getItem(`course_${id}_enrolled`)
    });

    if (!isPurchased) {
      console.log("⛔ User not enrolled, redirecting...");
      router.replace("/");
      return;
    }

    console.log("✅ User enrolled, loading course content...");
    setChecked(true);
  }, [id, data, isLoading, error, router]);

  if (!checked || isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Type assertion for the response
  const response = data as LoadUserResponse;
  
  if (!response?.user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Transform the API user to match CourseContent's IUser interface
  const userForCourseContent = {
    _id: response.user._id,
    name: response.user.name,
    email: response.user.email,
    role: response.user.role,
    avatar: response.user.avatar 
      ? { url: response.user.avatar.url }
      : undefined,
  };

  return <CourseContent id={id} user={userForCourseContent} />;
};

export default Page;