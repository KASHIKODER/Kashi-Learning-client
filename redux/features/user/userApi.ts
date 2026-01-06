import { apiSlice } from "../api/apiSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
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
    updateAvatar: builder.mutation<ApiResponse, { avatar: string }>({
      query: ({ avatar }) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: JSON.stringify({ avatar }),
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'],
    }),

    editProfile: builder.mutation<ApiResponse, { name: string }>({
      query: ({ name }) => ({
        url: "update-user-info",
        method: "PUT",
        body: JSON.stringify({ name }),
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: builder.mutation<ApiResponse, { oldPassword: string; newPassword: string }>({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: "include" as const,
      }),
    }),

    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: "get-users",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ['User'],
    }),

    updateUserRole: builder.mutation<UpdateUserRoleResponse, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: "update-user",
        method: "PUT",
        body: JSON.stringify({ userId, role }),
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'],
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

    deleteUser: builder.mutation<ApiResponse, string>({
      query: (id: string) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ['User'],
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
