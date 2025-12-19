'use client'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminSidebar from '../../components/Admin/sidebar/AdminSidebar'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import AllCourses from '../../components/Admin/Course/AllCourses'

const page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="ELearning - Admin"
                    description="ELearning is a platform for student to learn and get help from teachers"
                    keywords="Programming,MERN,Redux,Machine Learning"
                />
                <div className="fle h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar />
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero />
                        <AllCourses />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default page
