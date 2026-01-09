import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";
import type { User as AuthUser } from "../auth/authSlice";

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

// ✅ SIMPLE: Just basic fetchBaseQuery
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: "include",
  }),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Courses", "User"],
  endpoints: (builder) => ({
    refreshToken: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query<LoadUserResponse, void>({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
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
          
          if (result.data.activationToken) {
            localStorage.setItem('token', result.data.activationToken);
          }
          
          dispatch(userLoggedIn({
            accessToken: result.data.activationToken,
            user: userData,
          }));
          
        } catch (err: any) {
          console.error('Load user error:', err);
          
          // Logout on any error for now (simplify)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          dispatch(userLoggedOut());
        }
      },
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
} = apiSlice;