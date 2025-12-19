import { useGetUsersAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import CourseCard from "../Course/CourseCard"
import { AiOutlineUnorderedList } from 'react-icons/ai'

// IMPORTANT: These types MUST match exactly with CourseCard types
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ILink {
  title: string;
  url: string;
}

interface IComment {
  user: IUser;
  question: string;
  questionReplies?: IComment[];
}

interface IReview {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ICourseData {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string; // This might be causing issues - should it be optional?
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface IThumbnail {
  public_id: string;
  url: string;
}

interface ICourse {
  _id: string;
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatePrice?: number;
  thumbnail: IThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  courses?: ICourse[];
  message?: string;
  success?: boolean;
}

const Courses = () => {
    const { data, isLoading } = useGetUsersAllCoursesQuery({});
    const [courses, setCourses] = useState<ICourse[]>([]);

    useEffect(() => {
        const apiData = data as ApiResponse | undefined;
        if (apiData?.courses) {
            // Transform the data to match the exact interface
            const transformedCourses: ICourse[] = apiData.courses.map(course => ({
                ...course,
                // Ensure all required fields exist with defaults
                categories: course.categories || '',
                tags: course.tags || '',
                level: course.level || '',
                demoUrl: course.demoUrl || '',
                benefits: course.benefits || [],
                prerequisites: course.prerequisites || [],
                reviews: course.reviews || [],
                courseData: (course.courseData || []).map(dataItem => ({
                    ...dataItem,
                    videoThumbnail: dataItem.videoThumbnail || '', // Make sure this exists
                })),
                thumbnail: course.thumbnail || { public_id: '', url: '' },
                ratings: course.ratings || 0,
                purchased: course.purchased || 0,
            }));
            setCourses(transformedCourses);
        } else {
            setCourses([]);
        }
    }, [data]);

    return (
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Simple Background */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-2xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-2xl" />

            <div className="relative w-[95%] 800px:w-[90%] m-auto py-8 sm:py-12">
                {/* Compact Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Featured Courses
                        </span>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl 800px:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
                        Expand Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Career
                        </span>
                    </h1>
                    
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                        Discover courses to boost your skills and advance your career
                    </p>
                </div>

                {/* Compact Courses Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 1500px:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-gray-300 dark:bg-gray-700 h-36 rounded-xl mb-3" />
                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 1500px:grid-cols-4 gap-4 sm:gap-6">
                        {courses.length > 0 ? (
                            courses.map((item) => (
                                <CourseCard
                                    item={item}
                                    key={item._id}
                                />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <AiOutlineUnorderedList size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        No Courses Found
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        New courses coming soon
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Courses