'use client';
import React from 'react';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Heading from '@/app/utils/Heading';
import DashboardHeader from '@/app/components/Admin/DashboardHeader';
import UserAnalytics from '@/app/components/Admin/Analytics/UserAnalytics';

const page = () => {
  return (
    <div>
      <Heading
        title="ELearning - User Analytics"
        description="Monitor user growth, engagement, and retention trends over time."
        keywords="user analytics, growth, admin, engagement"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] min-h-screen">
          <DashboardHeader />
          <UserAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
