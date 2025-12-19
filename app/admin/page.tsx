import React from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";
import AdminProtected from '../hooks/adminProtected';
import DashboardHero from "../components/Admin/DashboardHero"

type Props = object;

const page = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="ELearning - Admin"
                    description="ELearning is a platform for student to learn and get help from teachers"
                    keywords="Programming,MERN,Redux,Machine Learning"
                />
                <div className="flex w-full min-h-screen">
                    <div className="hidden md:block md:w-[18%] lg:w-[16%]">
                        <AdminSidebar />
                    </div>
                    <div className="w-full md:w-[82%] lg:w-[84%]">
                         <DashboardHero isDashboard={true}/>
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default page
