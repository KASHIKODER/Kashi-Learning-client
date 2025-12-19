'use client';
import React, { FC, useEffect, useState } from 'react';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CourseData from './CourseData';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import {
  useEditCourseMutation,
  useGetAllCoursesQuery,
} from '@/redux/features/courses/coursesApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Define types based on what child components expect
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

interface CourseBenefit {
  title: string;
}

interface CoursePrerequisite {
  title: string;
}

// IMPORTANT: Match exactly what CourseInformation expects
// From your earlier CourseInformation code:
// type Props = {
//   courseInfo: any; // This should be CourseInfo type
//   setCourseInfo: (courseInfo: any) => void;
//   active: number;
//   setActive: (active: number) => void;
// };
interface CourseInfo {
  name?: string;
  description?: string;
  price?: string | number;
  estimatedPrice?: string | number;
  tags?: string;
  level?: string;
  categories?: string;
  demoUrl?: string;
  thumbnail?: string;
}

// For CoursePreview component - it expects specific structure
interface CourseDataForPreview {
  name?: string;
  description?: string;
  price?: number;
  estimatedPrice?: number;
  demoUrl?: string;
  benefits?: CourseBenefit[];
  prerequisites?: CoursePrerequisite[];
  thumbnail?: string;
  tags?: string;
  level?: string;
  totalVideos?: number;
  courseContent?: CourseContentItem[];
}

// For API submission
interface CourseDataForAPI {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
  totalVideos: number;
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  courseContent: CourseContentItem[];
}

interface CourseFromAPI {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: {
    url: string;
  };
  benefits: CourseBenefit[];
  prerequisites: CoursePrerequisite[];
  courseContent: CourseContentItem[];
}

interface CoursesResponse {
  courses: CourseFromAPI[];
}

type Props = {
  id: string;
};

const EditCourse: FC<Props> = ({ id }) => {
  const router = useRouter();
  const [editCourse, { isSuccess, error }] = useEditCourseMutation();
  const { data, isLoading} = useGetAllCoursesQuery({}, { skip: !id });

  // ✅ States - Make sure courseInfo is never null for CourseInformation
  const [active, setActive] = useState(0);
  
  // Initialize with default values so it's never null when passed to CourseInformation
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: '',
    description: '',
    price: '',
    estimatedPrice: '',
    tags: '',
    level: '',
    demoUrl: '',
    thumbnail: '',
  });
  
  const [benefits, setBenefits] = useState<CourseBenefit[]>([]);
  const [prerequisites, setPrerequisites] = useState<CoursePrerequisite[]>([]);
  const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([]);
  
  // Two separate states: one for preview, one for API
  const [previewCourseData, setPreviewCourseData] = useState<CourseDataForPreview | null>(null);
  const [apiCourseData, setApiCourseData] = useState<CourseDataForAPI | null>(null);

  const editCourseData = data && 'courses' in data 
    ? (data as CoursesResponse).courses.find((i: CourseFromAPI) => i._id === id)
    : null;

  // ✅ Pre-fill data when course loads
  useEffect(() => {
    if (!editCourseData) return;

    const info: CourseInfo = {
      name: editCourseData.name || '',
      description: editCourseData.description || '',
      price: editCourseData.price || 0,
      estimatedPrice: editCourseData.estimatedPrice || 0,
      tags: editCourseData.tags || '',
      level: editCourseData.level || '',
      demoUrl: editCourseData.demoUrl || '',
      thumbnail: editCourseData.thumbnail?.url || '',
    };

    setCourseInfo(info);

    setBenefits(editCourseData.benefits?.length ? editCourseData.benefits : [{ title: '' }]);
    setPrerequisites(
      editCourseData.prerequisites?.length ? editCourseData.prerequisites : [{ title: '' }]
    );

    setCourseContentData(
      editCourseData.courseContent?.map((c: CourseContentItem, i: number) => ({
        videoUrl: c.videoUrl || '',
        title: c.title || '',
        description: c.description || '',
        videoSection: c.videoSection || `Section ${i + 1}`,
        links: Array.isArray(c.links) && c.links.length > 0 ? c.links : [{ title: '', url: '' }],
        suggestion: c.suggestion || '',
        videoLength: c.videoLength || '',
      })) || []
    );
  }, [editCourseData]);

  // ✅ Prepare final data for preview and API
  const handleSubmit = () => {
    const formattedContent =
      courseContentData.length > 0 ? courseContentData : editCourseData?.courseContent || [];

    // Data for CoursePreview component
    const previewData: CourseDataForPreview = {
      name: courseInfo.name || '',
      description: courseInfo.description || '',
      price: Number(courseInfo.price) || 0,
      estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
      demoUrl: courseInfo.demoUrl || '',
      thumbnail: courseInfo.thumbnail || '',
      tags: courseInfo.tags || '',
      level: courseInfo.level || '',
      totalVideos: formattedContent.length,
      benefits: benefits.filter(b => b.title.trim() !== ''),
      prerequisites: prerequisites.filter(p => p.title.trim() !== ''),
      courseContent: formattedContent,
    };

    // Data for API submission
    const apiData: CourseDataForAPI = {
      name: courseInfo.name || '',
      description: courseInfo.description || '',
      price: courseInfo.price?.toString() || '',
      estimatedPrice: courseInfo.estimatedPrice?.toString() || '',
      tags: courseInfo.tags || '',
      level: courseInfo.level || '',
      demoUrl: courseInfo.demoUrl || '',
      thumbnail: courseInfo.thumbnail || '',
      totalVideos: formattedContent.length,
      benefits: benefits.filter(b => b.title.trim() !== ''),
      prerequisites: prerequisites.filter(p => p.title.trim() !== ''),
      courseContent: formattedContent,
    };

    setPreviewCourseData(previewData);
    setApiCourseData(apiData);
  };

  // ✅ Handle update
  const handleCourseUpdate = async () => {
    if (!editCourseData?._id) {
      toast.error('Invalid Course ID');
      return;
    }
    
    if (!apiCourseData) {
      toast.error('Please complete all steps before updating');
      return;
    }
    
    await editCourse({ id: editCourseData._id, data: apiCourseData });
  };

  // ✅ Handle redirect on success
  useEffect(() => {
    if (isSuccess) {
      toast.success('Course updated successfully!');
      router.push('/admin/courses');
    }
    if (error) {
      if ('data' in error) {
        const errorMessage = error as { data?: { message?: string } };
        toast.error(errorMessage.data?.message || 'Failed to update course');
      } else {
        toast.error('Failed to update course');
      }
    }
  }, [isSuccess, error, router]);

  if (isLoading || !editCourseData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0f172a] pt-16 transition-colors duration-300">
      <div className="max-w-[1250px] mx-auto px-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-lg overflow-y-auto">
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

          {active === 3 && (
            <CoursePreview
              active={active}
              setActive={setActive}
              courseData={previewCourseData || {
                name: courseInfo.name || '',
                description: courseInfo.description || '',
                price: Number(courseInfo.price) || 0,
                estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
                demoUrl: courseInfo.demoUrl || '',
                thumbnail: courseInfo.thumbnail || '',
                tags: courseInfo.tags || '',
                level: courseInfo.level || '',
                benefits: benefits,
                prerequisites: prerequisites,
                totalVideos: courseContentData.length,
                courseContent: courseContentData,
              }}
              handleCourseCreate={handleCourseUpdate}
              isEdit={true}
            />
          )}
        </div>

        <aside className="w-full lg:w-[25%]">
          <div className="sticky top-20">
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Edit Course
              </h2>
              <CourseOptions active={active} setActive={setActive} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditCourse;