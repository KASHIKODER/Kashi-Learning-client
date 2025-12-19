"use client";

import React from 'react';
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import Heading from '../utils/Heading';
import DashboardHeader from '../components/Admin/DashboardHeader';
import EditFaq from '../components/Admin/Customization/EditFaq';
import AdminProtected from '../hooks/adminProtected';

type Props = object;

const Page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="ELearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/5 1500px:w-[16%]">
            <AdminSidebar />
          </div>

          {/* Main Content */}
          <div className="w-[85%] flex flex-col h-full">
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto p-4">
              <EditFaq />
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;
