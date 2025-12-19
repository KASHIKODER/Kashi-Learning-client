import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

// Define interface for the review item
interface IReviewUser {
  name: string;
  profession?: string;
  avatar: string;
}

interface IReviewItem {
  _id?: string;
  user?: IReviewUser;
  rating: number;
  comment: string;
  course?: string;
  createdAt?: string;
  updatedAt?: string;
  // For backward compatibility with old structure
  name?: string;
  profession?: string;
  avatar?: string;
  ratings?: number;
}

type Props = {
    item: IReviewItem;
    index: number;
}

const ReviewCard = (props: Props) => {
    const { item, index } = props;

    // Extract user information safely
    const userName = item.user?.name || item.name || 'Anonymous';
    const userProfession = item.user?.profession || item.profession || 'Student';
    const userAvatar = item.user?.avatar || item.avatar || '/default-avatar.png';
    const userRating = item.rating || item.ratings || 0;
    const courseName = item.course || 'Unknown Course';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 overflow-hidden"
        >
            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
            
            {/* Quote Icon */}
            <div className="absolute top-4 left-4 text-blue-500/20 group-hover:text-blue-500/30 transition-colors duration-300">
                <FaQuoteLeft size={32} />
            </div>

            {/* Header Section */}
            <div className="flex items-start gap-4 mb-4 relative z-10">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-0.5">
                            <Image 
                                src={userAvatar}
                                alt={userName}
                                width={56}
                                height={56}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/default-avatar.png';
                                }}
                            />
                        </div>
                    </div>
                    {/* Online Status */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                        {userName}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate">
                        {userProfession}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Course: {courseName}
                    </p>
                </div>

                {/* Ratings */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar 
                                key={star}
                                size={14}
                                className={star <= userRating 
                                    ? "text-yellow-500 fill-current" 
                                    : "text-gray-300 dark:text-gray-600"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {userRating.toFixed(1)} rating
                    </span>
                </div>
            </div>

            {/* Review Text */}
            <div className="relative z-10">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300 text-sm">
                    {item.comment}
                </p>
                
                {/* Read More Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all duration-500 pointer-events-none"></div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
    );
}

export default ReviewCard;