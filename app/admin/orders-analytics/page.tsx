'use client';
import React from 'react';
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar';
import Heading from '@/app/utils/Heading';
import DashboardHeader from '@/app/components/Admin/DashboardHeader';
import OrderAnalytics from '@/app/components/Admin/Analytics/OrderAnalytics';

const page = () => {
  return (
    <div>
      <Heading
        title="ELearning - Order Analytics"
        description="Track order performance and revenue trends over the past year."
        keywords="order analytics, sales, revenue, dashboard"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] min-h-screen">
          <DashboardHeader />
          <OrderAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
