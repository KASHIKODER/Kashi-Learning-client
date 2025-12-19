import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: "get-all-notifications",
                method: "GET",
                credentials: "include" as const,
            }),
        }),

        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                url: `/update-notification/${id}`,
                method: "PUT",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useUpdateNotificationStatusMutation,
} = notificationsApi;
