'use client';
import React, { useEffect, useState } from 'react';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import { useCreateCourseMutation } from '../../../../redux/features/courses/coursesApi';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

// Define types based on what the child components actually expect

// From CourseInformation component (your earlier code showed this):
interface CourseInfoForComponent {
  name?: string;
  description?: string;
  price?: string | number;
  estimatedPrice?: string | number;
  tags?: string;
  level?: string;
  demoUrl?: string;
  thumbnail?: string;
  // categories might not be in CourseInformation
}

// From CourseContent component:
interface CourseLink {
  title: string;
  url: string;
}

interface CourseContentItem {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength?: string;
  links: CourseLink[];
  suggestion?: string;
}

// From CourseData component:
interface CourseBenefit {
  title: string;
}

interface CoursePrerequisite {
  title: string;
}

// From CoursePreview component:
interface CourseDataForPreview {
  name?: string;
  description?: string;
  price?: number;
  estimatedPrice?: number;
  demoUrl?: string;
  benefits?: CourseBenefit[];
  prerequisites?: CoursePrerequisite[];
  // Add other fields that CoursePreview might use
}

// For API submission (backend expects):
interface CourseDataForAPI {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
  categories: string;
  totalVideos: number;
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  courseContent: Array<{
    videoUrl: string;
    title: string;
    description: string;
    videoLength?: string;
    videoSection: string;
    links: CourseLink[];
    suggestion?: string;
  }>;
}

const CreateCourse = () => {
  const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Course Created Successfully');
      redirect('/admin/courses');
    }
    if (error) {
      if ('data' in error) {
        const errorMessage = error as { data?: { message?: string } };
        toast.error(errorMessage.data?.message || 'An error occurred');
      } else {
        toast.error('An error occurred');
      }
    }
  }, [isSuccess, error]);
  
  const [active, setActive] = useState(0);
  
  // Use the exact type that CourseInformation expects
  const [courseInfo, setCourseInfo] = useState<CourseInfoForComponent>({
    name: '',
    description: '',
    price: '',
    estimatedPrice: '',
    tags: '',
    level: '',
    demoUrl: '',
    thumbnail: '',
  });

  // Add categories separately since CourseInformation might not handle it
  const [categories] = useState('');

  const [benefits, setBenefits] = useState<CourseBenefit[]>([{ title: '' }]);
  const [prerequisites, setPrerequisites] = useState<CoursePrerequisite[]>([{ title: '' }]);
  const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([
    {
      videoUrl: '',
      title: '',
      description: '',
      videoSection: 'Untitled Section',
      links: [{ title: '', url: '' }],
    },
  ]);
  
  // Create two separate states: one for preview, one for API
  const [previewCourseData, setPreviewCourseData] = useState<CourseDataForPreview | null>(null);
  const [apiCourseData, setApiCourseData] = useState<CourseDataForAPI | null>(null);

  const handleSubmit = () => {
    // Format data for CoursePreview component
    const previewData: CourseDataForPreview = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: Number(courseInfo.price) || 0,
      estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
      demoUrl: courseInfo.demoUrl,
      benefits: benefits,
      prerequisites: prerequisites,
    };

    // Format data for API submission
    const apiData: CourseDataForAPI = {
      name: courseInfo.name || '',
      description: courseInfo.description || '',
      price: courseInfo.price?.toString() || '',
      estimatedPrice: courseInfo.estimatedPrice?.toString() || '',
      tags: courseInfo.tags || '',
      level: courseInfo.level || '',
      demoUrl: courseInfo.demoUrl || '',
      thumbnail: courseInfo.thumbnail || '',
      categories: categories,
      totalVideos: courseContentData.length,
      benefits: benefits.filter(b => b.title.trim() !== ''),
      prerequisites: prerequisites.filter(p => p.title.trim() !== ''),
      courseContent: courseContentData.map((item) => ({
        videoUrl: item.videoUrl,
        title: item.title,
        description: item.description,
        videoLength: item.videoLength || '',
        videoSection: item.videoSection,
        links: item.links.filter(link => link.title.trim() !== '' && link.url.trim() !== ''),
        suggestion: item.suggestion || '',
      })).filter(item => item.title.trim() !== ''), // Only include non-empty items
    };

    setPreviewCourseData(previewData);
    setApiCourseData(apiData);
  };

  const handleCourseCreate = async () => {
    if (!apiCourseData) {
      toast.error('Please complete all steps before creating the course');
      return;
    }
    
    if (!isLoading) {
      try {
        await createCourse(apiCourseData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (erro) {
        // Error is already handled by the mutation
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300 pt-16">
      <div className="max-w-[1250px] mx-auto px-4 flex flex-col lg:flex-row gap-6">
        {/* Left Content Section */}
        <div className="flex-1 bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-lg transition-all duration-300 max-h-[calc(100vh-6rem)] overflow-y-auto">
          {active === 0 && (
            <CourseInformation
              courseInfo={courseInfo}
              setCourseInfo={setCourseInfo}
              active={active}
              setActive={setActive}
            />
          )}
          {active === 1 && (
            <CourseData
              benefits={benefits}
              setBenefits={setBenefits}
              prerequisites={prerequisites}
              setPrerequisites={setPrerequisites}
              active={active}
              setActive={setActive}
            />
          )}
          {active === 2 && (
            <CourseContent
              active={active}
              setActive={setActive}
              courseContentData={courseContentData}
              setCourseContentData={setCourseContentData}
              handleSubmit={handleSubmit}
            />
          )}
          {active === 3 && previewCourseData && (
            <CoursePreview
              active={active}
              setActive={setActive}
              courseData={previewCourseData}
              handleCourseCreate={handleCourseCreate}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[25%]">
          <div className="sticky top-20">
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800 dark:text-white tracking-wide">
                Create Course
              </h2>
              <CourseOptions active={active} setActive={setActive} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateCourse;