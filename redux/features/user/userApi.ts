import { apiSlice } from "../api/apiSlice";

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateUserRoleResponse {
  success: boolean;
  message?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Update user avatar
    updateAvatar: builder.mutation<ApiResponse, { avatar: string | File }>({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),

    // ✅ Edit profile
    editProfile: builder.mutation<ApiResponse, { name: string }>({
      query: ({ name }) => ({
        url: "update-user-info",
        method: "PUT",
        body: { name },
        credentials: "include" as const,
      }),
    }),

    // ✅ Update password
    updatePassword: builder.mutation<ApiResponse, { oldPassword: string; newPassword: string }>({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),

    // ✅ Get all users
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['User'], // Simplified
    }),

    // ✅ Update user role (Admin only)
    updateUserRole: builder.mutation<UpdateUserRoleResponse, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: "update-user",
        method: "PUT",
        body: { userId, role },
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'], // Simplified
      transformResponse: (response: ApiResponse<User>): UpdateUserRoleResponse => {
        return {
          success: response.success || true,
          message: response.message || "Role updated successfully",
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken
        };
      },
    }),

    // ✅ Delete user (Admin only)
    deleteUser: builder.mutation<ApiResponse, string>({
      query: (id: string) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'], // Simplified
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;