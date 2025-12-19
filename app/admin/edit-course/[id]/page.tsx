import React from 'react';
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from '../../../../app/utils/Heading';
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader';
import EditCourse from '../../../components/Admin/Course/EditCourse';

type Props = object;

const page = async ({ params }: any) => {
    const { id } = await params;
    return (
        <div className="h-screen flex flex-col">
            <Heading
                title="ELearning - Admin"
                description="ELearning is a platform for students to learn and get help from teachers"
                keywords="Programming , MERN , Redux , Machine Learning"
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
                        <EditCourse id={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
