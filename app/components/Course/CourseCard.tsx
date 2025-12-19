import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineUnorderedList, AiOutlinePlayCircle } from 'react-icons/ai';
import { FiUsers, FiStar } from 'react-icons/fi';
import { IoRibbonOutline } from 'react-icons/io5';

// Base types without Document extension for frontend use
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed
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
  videoThumbnail: string;
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

interface Props {
  item: ICourse;
  isProfile?: boolean;
}

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  const isPopular = item.purchased ? item.purchased > 1000 : false;
  const isBestSeller = item.ratings ? item.ratings > 4.5 : false;
  const lecturesCount = item.courseData?.length || 0;

  return (
    <Link href={!isProfile ? `/course/${item._id}` : `course-access/${item._id}`}>
      <div className="group w-full min-h-[300px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/30 border border-gray-200/80 dark:border-gray-700/80 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer relative">
        
        {/* Premium Badge */}
        {isBestSeller && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <FiStar className="fill-current" size={10} />
              <span>Bestseller</span>
            </div>
          </div>
        )}

        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <IoRibbonOutline size={10} />
              <span>Popular</span>
            </div>
          </div>
        )}

        {/* Thumbnail with Gradient Overlay */}
        <div className="relative w-full h-40 overflow-hidden">
          <Image 
            src={item.thumbnail.url} 
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-500">
              <AiOutlinePlayCircle className="text-white" size={28} />
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 right-3">
            <div className={`px-3 py-2 rounded-xl font-bold shadow-2xl transform group-hover:scale-105 transition-transform duration-300 ${
              item.price === 0 
                ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                : 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white'
            }`}>
              <span className="text-sm">
                {item.price === 0 ? "FREE" : `$${item.price}`}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 relative">
          {/* Course Title */}
          <h3 className="font-Poppins text-[15px] font-bold text-gray-800 dark:text-white line-clamp-2 mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {item.name}
          </h3>

          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-3">
              {/* Ratings */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-lg">
                  <FiStar className="text-orange-500 fill-current" size={12} />
                  <span className="text-xs font-bold text-gray-700 dark:text-white">
                    {(item.ratings || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Students */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                  <FiUsers className="text-blue-500" size={12} />
                  <span className="text-xs font-bold text-gray-700 dark:text-white">
                    {item.purchased || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Lectures - using courseData length */}
            {!isProfile && (
              <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg">
                <AiOutlineUnorderedList className="text-purple-500" size={12} />
                <span className="text-xs font-bold text-gray-700 dark:text-white">
                  {lecturesCount}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar for Popularity */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Popularity</span>
              <span>{Math.min(100, ((item.purchased || 0) / 100) * 10)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, ((item.purchased || 0) / 100) * 10)}%` }}
              />
            </div>
          </div>

          {/* Price & CTA Section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/80">
            <div className="flex items-center gap-2">
              {item.estimatePrice && item.estimatePrice > item.price && (
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through font-medium">
                  ${item.estimatePrice}
                </span>
              )}
              {item.price === 0 ? (
                <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-transparent bg-clip-text">
                  Free
                </span>
              ) : (
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  ${item.price}
                </span>
              )}
            </div>
            
            {/* Animated CTA Button */}
            <button 
              className="relative overflow-hidden group/btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                // Add your enrollment logic here
                console.log('Enroll clicked for course:', item._id);
              }}
            >
              <span className="relative z-10 flex items-center gap-1">
                Enroll Now
                <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all duration-500 pointer-events-none" />
      </div>
    </Link>
  );
};

export default CourseCard;