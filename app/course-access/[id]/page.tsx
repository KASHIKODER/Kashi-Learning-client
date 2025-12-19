// app/course-access/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter, useParams } from "next/navigation";
import Loader from "../../../app/components/Loader/Loader";
import CourseContent from "@/app/components/Course/CourseContent";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const { isLoading, error, data } = useLoadUserQuery(undefined);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!id) return;        // wait for id
    if (isLoading) return;

    if (error || !data?.user) {
      console.log("❌ User not authenticated, redirecting...");
      router.replace("/");
      return;
    }

    const isPurchased =
      data?.user?.courses?.some((c: any) => c.courseId === id) ||
      localStorage.getItem(`course_${id}_enrolled`) === "true";

    console.log("🔍 Enrollment Check:", {
      courseId: id,
      userCourses: data.user.courses,
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

  return <CourseContent id={id} user={data?.user} />;
};

export default Page;