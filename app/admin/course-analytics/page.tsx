'use client';
import React from 'react';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Heading from '@/app/utils/Heading';
import CourseAnalytics from '@/app/components/Admin/Analytics/CourseAnalytics';
import DashboardHeader from '@/app/components/Admin/DashboardHeader';

const page = () => {
  return (
    <div>
      <Heading
        title="ELearning - Course Analytics"
        description="Analyze course performance and growth trends over the past year."
        keywords="analytics, dashboard, eLearning, admin"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] min-h-screen">
          <DashboardHeader />
          <CourseAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
