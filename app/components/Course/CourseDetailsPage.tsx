'use client';
import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../Loader/Loader'
import React, { useState } from 'react'
import Heading from '@/app/utils/Heading';
import Header from '../Header';
import Footer from '../Footer';
import CourseDetails from "./CourseDetails"

type Props = {
    id: string;
}

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    
    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
                        <Heading
                            title={data.course.name + " - ELearning"}
                            description={
                                "ELearning is a programming community which is developed by KashiKoder for helping programmers"
                            }
                            keywords={data?.course?.tags}
                        />
                        <Header
                            route={route}
                            setRoute={setRoute}
                            open={open}
                            setOpen={setOpen}
                            activeItem={1}
                        />
                        <CourseDetails
                            data={data.course}
                        />
                        <Footer />
                    </div>
                )
            }
        </>
    )
}

export default CourseDetailsPage