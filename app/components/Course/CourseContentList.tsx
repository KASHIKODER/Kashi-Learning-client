'use client';
import React, { FC, useState, Dispatch, SetStateAction } from 'react'
import { BsChevronDown, BsChevronUp, BsPlayCircle } from 'react-icons/bs';
import { MdOutlineOndemandVideo } from "react-icons/md";
import { IoTimeOutline, IoLockClosed, IoLockOpen } from 'react-icons/io5';

// Types based on your Mongoose schema exactly
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

interface ICourseData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string; // Required based on your Mongoose schema
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
    data: ICourseData[];
    activeVideo?: number;
    setActiveVideo?: Dispatch<SetStateAction<number>>;
    isDemo?: boolean;
}

const CourseContentList: FC<Props> = (props) => {
    const { data, activeVideo, setActiveVideo, isDemo } = props;
    
    // Ensure data is always an array
    const contentArray: ICourseData[] = Array.isArray(data) ? data : [];

    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set<string>()
    );

    // Get unique video sections
    const videoSections: string[] = [
        ...new Set<string>(contentArray.map((item) => item.videoSection))
    ];

    let totalCount: number = 0;

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };

    return (
        <div className="w-full space-y-6">
            {videoSections.map((section: string, sectionIndex: number) => {
                const isSectionVisible = visibleSections.has(section);

                // Filter videos for this section
                const sectionVideos = contentArray.filter(
                    (item) => item.videoSection === section
                );

                const sectionVideoCount = sectionVideos.length;
                const sectionVideoLength = sectionVideos.reduce(
                    (totalLength, item) => totalLength + item.videoLength,
                    0
                );

                const sectionStartIndex = totalCount;
                totalCount += sectionVideoCount;

                const sectionContentHours = sectionVideoLength / 60;

                return (
                    <div 
                        key={`${section}-${sectionIndex}`}
                        className="group bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] backdrop-blur-sm"
                    >
                        {/* Section Header */}
                        <div 
                            className="bg-gradient-to-r from-slate-50 via-white to-blue-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/10 p-8 cursor-pointer transition-all duration-300 hover:from-blue-50/70 dark:hover:from-blue-900/5 relative overflow-hidden"
                            onClick={() => toggleSection(section)}
                        >
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                                <BsPlayCircle className="text-white" size={24} />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                {sectionVideoCount}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                                    Section {sectionIndex + 1}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                    {sectionVideoCount} {sectionVideoCount === 1 ? 'lesson' : 'lessons'}
                                                </span>
                                            </div>
                                            
                                            <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-3">
                                                {section}
                                            </h3>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                                    <MdOutlineOndemandVideo size={18} className="text-blue-500" />
                                                    {sectionVideoCount} videos
                                                </span>
                                                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                                    <IoTimeOutline size={18} className="text-green-500" />
                                                    {sectionVideoLength < 60 
                                                        ? `${sectionVideoLength} min`
                                                        : `${sectionContentHours.toFixed(1)} hours`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg border border-gray-200 dark:border-gray-600"
                                    aria-label={isSectionVisible ? "Collapse section" : "Expand section"}
                                >
                                    {isSectionVisible ? (
                                        <BsChevronUp size={20} className="text-gray-600 dark:text-gray-300" />
                                    ) : (
                                        <BsChevronDown size={20} className="text-gray-600 dark:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Section Content */}
                        {isSectionVisible && (
                            <div className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
                                {sectionVideos.map((item, index: number) => {
                                    const videoIndex = sectionStartIndex + index;
                                    const contentLength = item.videoLength / 60;
                                    const isActive = videoIndex === activeVideo;

                                    return (
                                        <div
                                            className={`group/item p-8 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-500 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-l-4 border-l-blue-500 shadow-inner'
                                                    : 'hover:bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:hover:from-gray-700/50 dark:hover:to-gray-700/30'
                                            }`}
                                            key={item._id}
                                            onClick={() => {
                                                if (!isDemo && setActiveVideo) {
                                                    setActiveVideo(videoIndex);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (!isDemo && setActiveVideo && (e.key === 'Enter' || e.key === ' ')) {
                                                    e.preventDefault();
                                                    setActiveVideo(videoIndex);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/item:scale-110 ${
                                                    isActive
                                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                                                        : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-400 group-hover/item:from-blue-200 group-hover/item:to-blue-300'
                                                }`}>
                                                    {isActive ? (
                                                        <BsPlayCircle size={22} />
                                                    ) : isDemo ? (
                                                        <IoLockClosed size={22} />
                                                    ) : (
                                                        <IoLockOpen size={22} />
                                                    )}
                                                    
                                                    {/* Progress indicator */}
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                                                            {videoIndex + 1}
                                                        </span>
                                                        <h4 className={`font-bold text-lg truncate ${
                                                            isActive
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400'
                                                        }`}>
                                                            {item.title}
                                                        </h4>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                                                            <IoTimeOutline size={16} className="text-green-500" />
                                                            {item.videoLength > 60
                                                                ? `${contentLength.toFixed(1)} hours`
                                                                : `${item.videoLength} minutes`
                                                            }
                                                        </span>
                                                        
                                                        {isActive && (
                                                            <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
                                                                Currently playing
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Hover arrow */}
                                                <div className={`opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/item:translate-x-0 ${
                                                    isActive ? 'text-blue-500' : 'text-gray-400'
                                                }`}>
                                                    <BsPlayCircle size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Empty state */}
            {contentArray.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <MdOutlineOndemandVideo size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                        No Course Content Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Course content will be added soon
                    </p>
                </div>
            )}
        </div>
    );
}

export default CourseContentList;