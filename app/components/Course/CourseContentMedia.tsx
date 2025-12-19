import { styles } from '@/app/styles/style';
import CoursePlayer from '@/app/utils/CoursePlayer';
import Image from 'next/image';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AiFillStar, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineStar } from 'react-icons/ai';
import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { BiMessageRounded, BiLike, BiDislike } from 'react-icons/bi';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';

// Types based on your Mongoose schema
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
  };
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

type Props = {
    data: ICourseData[];
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    user: IUser;
}

const CourseContentMedia = ({ data, id, activeVideo, setActiveVideo, user }: Props) => {
    const [activeBar, setactiveBar] = useState(0);
    const [question, setQuestion] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);

    const isReviewExists = data[activeVideo]?.review?.find(
        (item: IReview) => item?.user?._id === user?._id
    );

    const prevButton = () => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1);
    const nextButton = () => setActiveVideo(data && data.length - 1 === activeVideo ? activeVideo : activeVideo + 1);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg backdrop-blur-lg transition-colors duration-300">
            
            {/* Video Player Container - Matching CoursePreview Style */}
            <div className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-black">
                <CoursePlayer
                    title={data?.[activeVideo]?.title || ""}
                    videoUrl={data?.[activeVideo]?.videoUrl || ""}
                />
                <div className="absolute top-4 right-4">
                    <div className="bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-gray-600">
                        Lesson {activeVideo + 1} of {data?.length || 0}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons - Enhanced Design */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6">
                <button
                    className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 w-full sm:w-auto justify-center ${
                        activeVideo === 0 
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    }`}
                    onClick={prevButton}
                    disabled={activeVideo === 0}
                >
                    <AiOutlineArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Previous Lesson
                </button>

                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Progress: {activeVideo + 1} / {data?.length || 0}
                    </span>
                </div>

                <button
                    className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 w-full sm:w-auto justify-center ${
                        data.length - 1 === activeVideo 
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    }`}
                    onClick={nextButton}
                    disabled={data.length - 1 === activeVideo}
                >
                    Next Lesson
                    <AiOutlineArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Lesson Title Section */}
            <div className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-3">
                    {data?.[activeVideo]?.title || "Lesson Title"}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                
                {/* Lesson Stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        <AiOutlineStar className="text-yellow-500" />
                        {data?.[activeVideo]?.review?.length || 0} Reviews
                    </span>
                    <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        <BiMessageRounded className="text-blue-500" />
                        {data?.[activeVideo]?.questions?.length || 0} Questions
                    </span>
                    <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                        <IoCheckmarkDoneOutline className="text-green-500" />
                        {Math.floor((data?.[activeVideo]?.videoLength || 0) / 60)} min
                    </span>
                </div>
            </div>

            {/* Tab Navigation - Enhanced Design */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
                        <button
                            key={index}
                            className={`flex-1 min-w-[120px] py-4 px-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeBar === index 
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105" 
                                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => setactiveBar(index)}
                        >
                            {text}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Container */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                
                {/* Overview Tab */}
                {activeBar === 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Lesson Description
                            </h3>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {data?.[activeVideo]?.description || "No description available for this lesson."}
                            </p>
                        </div>

                        {/* Learning Objectives */}
                        {data?.[activeVideo]?.suggestion && (
                            <div className="mt-6">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <IoCheckmarkDoneOutline className="text-green-500" />
                                    Learning Suggestion
                                </h4>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {data[activeVideo].suggestion}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Resources Tab */}
                {activeBar === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Learning Resources
                            </h3>
                        </div>
                        
                        {Array.isArray(data?.[activeVideo]?.links) && data?.[activeVideo]?.links.length > 0 ? (
                            <div className="grid gap-4">
                                {data[activeVideo].links.map((item: ILink, index: number) => (
                                    <div key={index} className="group bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                                    <FiDownload className="text-blue-500" />
                                                    {item?.title || "Resource"}
                                                </h4>
                                                <a
                                                    href={item?.url}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors break-words flex items-center gap-2 group/link"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {item?.url}
                                                    <FiExternalLink className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                                                <FiDownload size={20} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <FiDownload size={32} className="text-gray-400" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    No Resources Available
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400">
                                    This lesson doesn't have any additional resources yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Q&A Tab */}
                {activeBar === 2 && (
                    <div className="space-y-8">
                        {/* Ask Question Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-purple-500/30">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <BiMessageRounded className="text-blue-500" />
                                Ask a Question
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={user.avatar?.url || "/default-avatar.png"}
                                        width={60}
                                        height={60}
                                        alt="User Avatar"
                                        className="w-15 h-15 rounded-2xl object-cover border-2 border-white shadow-lg"
                                    />
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="What would you like to ask about this lesson? Share your doubts or thoughts..."
                                        rows={4}
                                        className="w-full bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none transition-all duration-300"
                                    />
                                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <BiLike size={18} />
                                                Add Reaction
                                            </button>
                                        </div>
                                        <button className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${styles.button}`}>
                                            Post Question
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <BiMessageRounded className="text-blue-500" />
                                Community Questions ({data?.[activeVideo]?.questions?.length || 0})
                            </h4>
                            {data?.[activeVideo]?.questions && data[activeVideo].questions.length > 0 ? (
                                <div className="space-y-4">
                                    {data[activeVideo].questions.map((question: IComment, index: number) => (
                                        <div key={question._id || index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start gap-3">
                                                <Image
                                                    src={question.user.avatar?.url || "/default-avatar.png"}
                                                    width={40}
                                                    height={40}
                                                    alt="User Avatar"
                                                    className="rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <h5 className="font-semibold text-gray-900 dark:text-white">
                                                        {question.user.name}
                                                    </h5>
                                                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                                                        {question.question}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <BiMessageRounded size={48} className="mx-auto mb-4 opacity-50" />
                                    <h5 className="text-lg font-semibold mb-2">No Questions Yet</h5>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Be the first to ask a question about this lesson!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeBar === 3 && (
                    <div className="space-y-8">
                        {!isReviewExists ? (
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-orange-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-500/30">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                    <AiFillStar className="text-yellow-500" />
                                    Share Your Feedback
                                </h3>
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={user.avatar?.url || "/default-avatar.png"}
                                            width={70}
                                            height={70}
                                            alt="User Avatar"
                                            className="w-17 h-17 rounded-2xl object-cover border-2 border-white shadow-lg"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        {/* Rating Section */}
                                        <div>
                                            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                How would you rate this lesson?
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setRating(i)}
                                                        className="transform transition-all duration-300 hover:scale-110 p-1"
                                                    >
                                                        {rating >= i ? (
                                                            <AiFillStar
                                                                className="text-4xl text-yellow-400 hover:text-yellow-500 transition-colors"
                                                            />
                                                        ) : (
                                                            <AiOutlineStar
                                                                className="text-4xl text-gray-300 hover:text-yellow-400 transition-colors"
                                                            />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Review Textarea */}
                                        <div>
                                            <textarea
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                placeholder="Share your thoughts about this lesson... What did you like? What could be improved? Your feedback helps us enhance the learning experience."
                                                rows={5}
                                                className="w-full bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm resize-none transition-all duration-300"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end">
                                            <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                Submit Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <AiFillStar size={32} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Review Submitted
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                                    Thank you for your valuable feedback!
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                    Your review has been recorded and will help improve this course.
                                </p>
                            </div>
                        )}

                        {/* Existing Reviews */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <AiOutlineStar className="text-yellow-500" />
                                Community Reviews ({data?.[activeVideo]?.review?.length || 0})
                            </h4>
                            {data?.[activeVideo]?.review && data[activeVideo].review.length > 0 ? (
                                <div className="space-y-4">
                                    {data[activeVideo].review.map((review: IReview, index: number) => (
                                        <div key={review._id || index} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start gap-3">
                                                <Image
                                                    src={review.user.avatar?.url || "/default-avatar.png"}
                                                    width={40}
                                                    height={40}
                                                    alt="User Avatar"
                                                    className="rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                                            {review.user.name}
                                                        </h5>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                <AiFillStar
                                                                    key={i}
                                                                    className={`text-sm ${
                                                                        i <= review.rating 
                                                                            ? "text-yellow-400" 
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <AiOutlineStar size={48} className="mx-auto mb-4 opacity-50" />
                                    <h5 className="text-lg font-semibold mb-2">No Reviews Yet</h5>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Be the first to share your thoughts about this lesson!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseContentMedia;