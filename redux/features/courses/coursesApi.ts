// redux/features/courses/courseApi.ts
import { apiSlice } from "../api/apiSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Create Course
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"], 
    }),

    // ✅ Get All Courses (Admin)
    getAllCourses: builder.query({
      query: () => ({
        url: "/get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"], 
    }),

    // ✅ Delete Course
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    // ✅ Edit Course
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),
    getUsersAllCourses: builder.query({
      query:() => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    
    getCourseDetails: builder.query({
      query:(id: string) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query:(id: string) => ({
        url: `/get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    })
  }),
  overrideExisting: false,
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery
} = coursesApi;
