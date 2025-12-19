import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import type { User as AuthUser } from "../auth/authSlice";
import type { RootState } from "../../store";

interface UserCourse {
  courseId: string;
}

interface ApiUser extends AuthUser {
  avatar?: {
    public_id: string;
    url: string;
  };
  isVerified?: boolean;
  courses?: UserCourse[];
}

interface LoadUserResponse {
  success?: boolean;
  message?: string;
  activationToken: string;
  user: ApiUser;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: "include",
    timeout: 30000,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      const state = getState() as RootState;
      const token = state.auth.token;
      
      let finalToken = token;
      if (!finalToken && typeof window !== 'undefined') {
        finalToken = localStorage.getItem('token') || "";
      }
      
      if (finalToken) {
        headers.set('Authorization', `Bearer ${finalToken}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ["Courses", "User"],
  endpoints: (builder) => ({
    refreshToken: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),

    loadUser: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          
          const userData: AuthUser = {
            _id: result.data.user._id,
            name: result.data.user.name,
            email: result.data.user.email,
            role: result.data.user.role,
            isVerified: result.data.user.isVerified,
            ...(result.data.user.courses && { courses: result.data.user.courses }),
            avatar: result.data.user.avatar?.url || result.data.user.avatar || undefined,
          };
          
          dispatch(userLoggedIn({
            accessToken: result.data.activationToken,
            user: userData,
          }));
          
        } catch (err: unknown) {
          if (err && typeof err === "object") {
            const errorObj = err as {
              error?: {
                status?: number;
                data?: { message?: string };
              };
            };

            if (errorObj.error?.status === 401) {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }
              dispatch(userLoggedOut());
            }
          }
        }
      },
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useLazyLoadUserQuery,
} = apiSlice;