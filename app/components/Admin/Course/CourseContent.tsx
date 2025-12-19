"use client";
import React, { FC, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import {
    AiOutlineDelete,
    AiOutlinePlusCircle,
} from "react-icons/ai";
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BsLink45Deg } from "react-icons/bs";

// Define types for course content
interface CourseLink {
    title: string;
    url: string;
}

interface CourseContentItem {
    videoUrl: string;
    title: string;
    description: string;
    videoSection: string;
    links: CourseLink[];
    videoLength?: string;
    suggestion?: string;
}

type CourseContentProps = {
    active: number;
    setActive: (active: number) => void;
    courseContentData: CourseContentItem[];
    setCourseContentData: (courseContentData: CourseContentItem[]) => void;
    handleSubmit: () => void;
};

const CourseContent: FC<CourseContentProps> = ({
    courseContentData,
    setCourseContentData,
    active,
    setActive,
    handleSubmit: handleCourseSubmit,
}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean[]>(
        Array(courseContentData?.length || 0).fill(false)
    );
    const [activeSection] = useState(1);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    const handleCollapseToggle = (index: number) => {
        const updatedCollapsed = [...isCollapsed];
        updatedCollapsed[index] = !updatedCollapsed[index];
        setIsCollapsed(updatedCollapsed);
    };

    const handleRemoveLink = (index: number, linkIndex: number) => {
        const updatedData = [...courseContentData];
        if (updatedData[index].links.length > 1) {
            updatedData[index].links.splice(linkIndex, 1);
            setCourseContentData(updatedData);
        }
    };

    const handleAddLink = (index: number) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.push({ title: "", url: "" });
        setCourseContentData(updatedData);
    };

    const newContentHandler = (item: CourseContentItem) => {
        if (
            item.title === "" ||
            item.description === "" ||
            item.videoUrl === "" ||
            item.links[0].title === "" ||
            item.links[0].url === ""
        ) {
            toast.error("Please fill all the fields first!");
            return;
        }

        let newVideoSection = "";
        if (courseContentData.length > 0) {
            const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;
            if (lastVideoSection) {
                newVideoSection = lastVideoSection;
            }
        }

        const newContent: CourseContentItem = {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: newVideoSection,
            links: [{ title: "", url: "" }],
            videoLength: "",
        };

        setCourseContentData([...courseContentData, newContent]);
    };

    const addNewSection = () => {
        if (!courseContentData || courseContentData.length === 0) {
            setCourseContentData([
                {
                    videoUrl: '',
                    title: '',
                    description: '',
                    videoSection: 'Untitled Section',
                    links: [{ title: '', url: '' }],
                    videoLength: '',
                },
            ]);
            return;
        }

        const last = courseContentData[courseContentData.length - 1];

        if (
            last.title === '' ||
            last.description === '' ||
            last.videoUrl === '' ||
            last.links.length === 0 ||
            last.links[0].title === '' ||
            last.links[0].url === ''
        ) {
            alert('Please fill the current section before adding a new one');
            return;
        }

        const newSection: CourseContentItem = {
            videoUrl: '',
            title: '',
            description: '',
            videoSection: `Section ${courseContentData.length + 1}`,
            links: [{ title: '', url: '' }],
            videoLength: '',
        };

        setCourseContentData([...courseContentData, newSection]);
    };

    const prevButton = () => setActive(active - 1);

    const handleOptions = () => {
        const last = courseContentData[courseContentData.length - 1];

        if (
            last.title === '' ||
            last.description === '' ||
            last.videoUrl === '' ||
            last.links.length === 0 ||
            last.links[0].title === '' ||
            last.links[0].url === ''
        ) {
            toast.error("Section can't be empty!");
        } else {
            setActive(active + 1);
            handleCourseSubmit();
        }
    };

    return (
        <div className="w-[90%] max-w-4xl m-auto mt-8 p-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Course Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Build your course structure with videos and resources
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {courseContentData.map((item: CourseContentItem, index: number) => {
                    const showSectionInput =
                        index === 0 ||
                        item.videoSection !== courseContentData[index - 1].videoSection;

                    return (
                        <div
                            key={index}
                            className={`w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                                border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl 
                                transition-all duration-300 overflow-hidden ${showSectionInput && index !== 0 ? "mt-8" : "mb-0"
                                }`}
                        >

                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-100 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold">
                                            {index + 1}
                                        </div>

                                        {/* Section title input */}
                                        {showSectionInput && (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    className="text-xl font-bold bg-transparent border-none outline-none 
                                                        text-gray-800 dark:text-white placeholder-gray-500 w-64"
                                                    value={item.videoSection}
                                                    placeholder="Section Title"
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].videoSection = e.target.value;
                                                        setCourseContentData(updatedData);
                                                    }}
                                                />
                                                <BiSolidPencil className="ml-2 text-blue-500" />
                                            </div>
                                        )}

                                        {isCollapsed[index] && item.title && (
                                            <p className="font-medium text-gray-700 dark:text-gray-300 text-lg">
                                                {item.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <AiOutlineDelete
                                            className={`text-xl ${index > 0
                                                ? "cursor-pointer text-red-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                                                : "opacity-30 cursor-not-allowed"
                                                }`}
                                            onClick={() => {
                                                if (index > 0) {
                                                    const updatedData = [...courseContentData];
                                                    updatedData.splice(index, 1);
                                                    setCourseContentData(updatedData);
                                                }
                                            }}
                                        />
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                            <MdOutlineKeyboardArrowDown
                                                className={`text-gray-600 dark:text-gray-300 transition-transform duration-300 ${isCollapsed[index] ? "rotate-180" : "rotate-0"
                                                    }`}
                                                onClick={() => handleCollapseToggle(index)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded content */}
                            {!isCollapsed[index] && (
                                <div className="p-6 space-y-6">
                                    {/* Video Title */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Video Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter video title..."
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                                rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                                            value={item.title}
                                            onChange={(e) => {
                                                const updatedData = [...courseContentData];
                                                updatedData[index].title = e.target.value;
                                                setCourseContentData(updatedData);
                                            }}
                                        />
                                    </div>

                                    {/* Video URL */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Video URL
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Paste video URL here..."
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                                rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                                            value={item.videoUrl}
                                            onChange={(e) => {
                                                const updatedData = [...courseContentData];
                                                updatedData[index].videoUrl = e.target.value;
                                                setCourseContentData(updatedData);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Video Length ( in min )
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="30"
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                                rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500"
                                            value={item.videoLength || ""}
                                            onChange={(e) => {
                                                const updatedData = [...courseContentData];
                                                updatedData[index].videoLength = e.target.value;
                                                setCourseContentData(updatedData);
                                            }}
                                        />
                                    </div>

                                    {/* Video Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Video Description
                                        </label>
                                        <textarea
                                            rows={5}
                                            placeholder="Describe what students will learn in this video..."
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                                                rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                                            value={item.description}
                                            onChange={(e) => {
                                                const updatedData = [...courseContentData];
                                                updatedData[index].description = e.target.value;
                                                setCourseContentData(updatedData);
                                            }}
                                        />
                                    </div>

                                    {/* Links */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Resource Links
                                            </label>
                                        </div>

                                        {item.links.map((link: CourseLink, linkIndex: number) => (
                                            <div key={linkIndex} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Link {linkIndex + 1}
                                                    </span>
                                                    <AiOutlineDelete
                                                        className={`${linkIndex === 0
                                                            ? "opacity-30 cursor-not-allowed"
                                                            : "text-red-400 cursor-pointer hover:text-red-600 hover:scale-110 transition-all"
                                                            } text-lg`}
                                                        onClick={() => handleRemoveLink(index, linkIndex)}
                                                    />
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Link title (e.g., Source Code, Documentation)"
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                                                        rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent 
                                                        transition-all text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                                                    value={link.title}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].links[linkIndex].title = e.target.value;
                                                        setCourseContentData(updatedData);
                                                    }}
                                                />

                                                <input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                                                        rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent 
                                                        transition-all text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const updatedData = [...courseContentData];
                                                        updatedData[index].links[linkIndex].url = e.target.value;
                                                        setCourseContentData(updatedData);
                                                    }}
                                                />
                                            </div>
                                        ))}

                                        {/* Add Link Button */}
                                        <button
                                            type="button"
                                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 
                                                dark:hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                                            onClick={() => handleAddLink(index)}
                                        >
                                            <BsLink45Deg className="mr-2 text-lg" />
                                            Add Resource Link
                                        </button>
                                    </div>

                                    {/* Add New Content */}
                                    {index === courseContentData.length - 1 && (
                                        <button
                                            type="button"
                                            className="flex items-center text-green-600 dark:text-green-400 hover:text-green-700 
                                                dark:hover:text-green-300 transition-colors duration-200 text-sm font-medium mt-4"
                                            onClick={() => newContentHandler(item)}
                                        >
                                            <AiOutlinePlusCircle className="mr-2 text-lg" />
                                            Add New Video
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add New Section */}
                <button
                    type="button"
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl 
                        hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                        transition-all duration-300 group"
                    onClick={addNewSection}
                >
                    <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        <AiOutlinePlusCircle className="mr-3 text-xl" />
                        <span className="font-medium">Add New Section</span>
                    </div>
                </button>
            </form>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-12">
                <button
                    onClick={prevButton}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl 
                        font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 
                        border border-gray-200 dark:border-gray-600 hover:shadow-md"
                >
                    Previous
                </button>
                <button
                    onClick={handleOptions}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl 
                        font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 
                        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CourseContent;