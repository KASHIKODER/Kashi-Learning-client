'use client';
import CoursePlayer from '@/app/utils/CoursePlayer';
import Ratings from '@/app/utils/Ratings';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IoCheckmarkDoneOutline,
  IoStar,
  IoPeople,
  IoPlayCircle,
  IoTime,
  IoRibbon,
  IoSparkles,
  IoLockOpen,
  IoVideocam,
  IoDocumentText,
  IoHeadset,
  IoPhonePortrait,
  IoShieldCheckmark,
  IoMedal,
} from 'react-icons/io5';
import { format } from 'timeago.js';
import CourseContentList from '../Course/CourseContentList';
import { handleRazorpayPayment } from '@/app/utils/razorpayHandler';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { toast } from 'react-hot-toast';

// Types based on your Mongoose schema
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
  };
  courses?: Array<string | { courseId?: string; _id?: string; id?: string }>;
}

interface ILink {
  title: string;
  url: string;
}

interface IComment {
  _id?: string;
  user: IUser;
  question: string;
  questionReplies?: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface IReview {
  _id?: string;
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

interface ICourseData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail?: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
  review?: IReview[];
  createdAt?: string;
  updatedAt?: string;
}

interface ICourseBenefit {
  title: string;
}

interface ICoursePrerequisite {
  title: string;
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
  benefits: ICourseBenefit[];
  prerequisites: ICoursePrerequisite[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
  data: ICourse;
};

const CourseDetails = ({ data }: Props) => {
  const router = useRouter();
  const { data: userData, refetch } = useLoadUserQuery(undefined, {});
  const user = userData?.user as IUser | undefined;

  const [isPurchased, setIsPurchased] = useState(false);

  const discountPercentage = (() => {
  const estimatePrice = data?.estimatePrice;
  const price = data?.price;
  
  // If no estimate price or price is not defined, or estimate price is not greater than price
  if (!estimatePrice || !price || estimatePrice <= price) return 0;
  if (estimatePrice === 0) return 0; // Prevent division by zero
  
  const discount = ((estimatePrice - price) / estimatePrice) * 100;
  return Math.max(0, Math.min(100, discount)); // Ensure between 0-100%
})();

const discountPercentagePrice = discountPercentage.toFixed(0);
  // ✅ check purchase state
  useEffect(() => {
    const userCourses = user?.courses ?? [];

    const hasCourse = userCourses.some((item) => {
      if (!item) return false;
      // handle strings (ids), objects with possible fields
      if (typeof item === 'string') return item === data?._id;
      if (typeof item === 'object') {
        return (
          item.courseId?.toString() === data?._id ||
          item._id?.toString() === data?._id ||
          item.id?.toString() === data?._id
        );
      }
      return false;
    });

    const localPurchased =
      typeof window !== 'undefined' &&
      localStorage.getItem(`course_${data?._id}_enrolled`) === 'true';

    if (hasCourse || localPurchased) {
      setIsPurchased(true);
    }
  }, [user, data?._id]);

  // ✅ handle Razorpay payment
  const handleOrder = async (e: React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      return;
    }

    await handleRazorpayPayment(data?._id, user, async () => {
      toast.success('Payment successful! Unlocking course...');

      // wait for backend update
      await new Promise((res) => setTimeout(res, 1500));

      await refetch?.();

      // update local state
      if (typeof window !== 'undefined'){
        localStorage.setItem(`course_${data?._id}_enrolled`, 'true');
      }
      setIsPurchased(true);

      // redirect to course access page
      router.push(`/course-access/${data?._id}`);
    });
  };

  return (
    <div>
      <div className="min-h-screen">
        {/* Premium Header Section - Fixed spacing */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white pt-32 pb-16 overflow-hidden mt-[-30px]">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div
              className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse"
              style={{ animationDelay: '3s' }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 mb-6">
                <IoRibbon className="text-yellow-300" size={20} />
                <span className="font-semibold">Premium Course</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {data?.name}
              </h1>

              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Master the skills that matter with our comprehensive course
                designed for modern professionals
              </p>

              <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <IoStar className="text-yellow-300" size={20} />
                  <span>{data?.ratings?.toFixed(1)} Course Rating</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <IoPeople size={20} />
                  <span>{data?.purchased}+ Students Enrolled</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <IoTime size={20} />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                <div className="relative">
                  <CoursePlayer videoUrl={data?.demoUrl} title={data?.name || ""} />
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      Preview
                    </div>
                  </div>
                </div>
              </div>

              {/* What You'll Learn */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <IoSparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      What You'll Learn
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Master these key skills and transform your career
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.benefits?.map((item: ICourseBenefit, index: number) => (
                    <div
                      className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300"
                      key={index}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300">
                        <IoCheckmarkDoneOutline size={16} className="text-white" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <IoLockOpen className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Prerequisites
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      What you need to know before starting
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data?.prerequisites?.map((item: ICoursePrerequisite, index: number) => (
                    <div
                      className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300"
                      key={index}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300">
                        <IoCheckmarkDoneOutline size={16} className="text-white" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <IoVideocam className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Course Content
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Comprehensive curriculum designed for success
                    </p>
                  </div>
                </div>
                <CourseContentList data={data?.courseData} />
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  About This Course
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {data?.description}
                  </p>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                      <IoStar className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Student Reviews
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        What our students say about this course
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                      <Ratings rating={data?.ratings || 0} />
                      <span>{data?.ratings?.toFixed(1)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {data?.reviews?.length || 0} Reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {data?.reviews &&
                    [...data.reviews]?.reverse()?.map((item: IReview, index: number) => (
                      <div
                        key={item._id || index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg uppercase">
                              {item?.user?.name?.slice(0, 2) || "US"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                {item?.user?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center gap-1">
                                <Ratings rating={item?.rating} />
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {item?.createdAt ? format(item.createdAt) : "Recently"}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                              {item?.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Premium Pricing Card */}
                <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-blue-200 dark:border-gray-700 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-full translate-y-8 -translate-x-8"></div>

                  <div className="relative">
                    {/* Price Display */}
                    <div className="text-center mb-6">
                      {data?.price === 0 ? (
                        <div className="mb-4">
                          <span className="text-5xl font-bold text-green-600">Free</span>
                          <div className="w-20 h-1 bg-green-500 mx-auto mt-2 rounded-full"></div>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <span className="text-5xl font-bold text-gray-900 dark:text-white">
                              ₹{data?.price}
                            </span>
                            {data?.estimatePrice && data.estimatePrice > data.price && (
                              <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                                ₹{data.estimatePrice}
                              </span>
                            )}
                          </div>
                          {data?.estimatePrice && data.estimatePrice > data.price && (
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold inline-block">
                              {discountPercentagePrice}% Off
                            </div>
                          )}
                          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-2 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {isPurchased ? (
                      <Link
                        href={`/course-access/${data?._id}`}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl block text-center mb-6 group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Continue Learning
                          <IoPlayCircle className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={handleOrder}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl mb-6 group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Enroll Now for ₹{data?.price}
                          <IoSparkles className="group-hover:rotate-180 transition-transform duration-300" size={20} />
                        </span>
                      </button>
                    )}

                    {/* Guarantee Badge */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 text-center mb-6">
                      <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200 font-semibold">
                        <IoShieldCheckmark size={20} />
                        30-Day Money-Back Guarantee
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-xl text-center mb-4">
                        🎯 What's Included
                      </h3>
                      {[
                        { icon: IoVideocam, text: 'HD video content', color: 'text-blue-500' },
                        { icon: IoDocumentText, text: 'Downloadable resources', color: 'text-green-500' },
                        { icon: IoMedal, text: 'Certificate of completion', color: 'text-yellow-500' },
                        { icon: IoHeadset, text: 'Premium support', color: 'text-purple-500' },
                        { icon: IoPhonePortrait, text: 'Mobile and TV access', color: 'text-pink-500' },
                        { icon: IoTime, text: 'Full lifetime access', color: 'text-orange-500' },
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ${feature.color}`}>
                            <feature.icon size={18} />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Course Stats Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 text-center">
                    📊 Course Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.purchased || 0}+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data?.reviews?.length || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data?.courseData?.length || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lectures</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data?.ratings?.toFixed(1) || "0.0"}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;