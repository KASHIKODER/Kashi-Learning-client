import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import type { User } from "./authSlice";

// Response types
type RegistrationResponse = {
  message: string;
  activationToken?: string;
  success: boolean;
};

type LoginResponse = {
  message: string;
  activationToken: string;
  user: User;
};

type ActivationResponse = {
  message: string;
  success: boolean;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, Record<string, unknown>>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result.data.success && result.data.activationToken) {
            dispatch(userRegistration({ token: result.data.activationToken }));
          }
        } catch (err: unknown) {
          let message = "Registration failed";

          if (err && typeof err === "object") {
            const errorObj = err as any;

            // Handle RTK Query network/timeout errors
            if (errorObj.status === "FETCH_ERROR") {
              message = "Cannot connect to server. Check your network or backend URL.";
            } else if (errorObj.status === "TIMEOUT_ERROR") {
              message = "Server took too long to respond. Try again later.";
            } 
            // Backend responded with error object
            else if ("error" in errorObj && errorObj.error?.data?.message) {
              message = errorObj.error.data.message;
            } 
            // HTTP error with status
            else if ("error" in errorObj && errorObj.error?.status) {
              message = `Error ${errorObj.error.status}`;
            }
          }

          console.error("🚨 Registration Error:", message);
        }
      },
    }),

    activation: builder.mutation<ActivationResponse, { activation_token: string; activation_code: string }>({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: { activation_token, activation_code },
      }),
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (err: unknown) {
          let message = "Login failed";

          if (err && typeof err === "object") {
            const errorObj = err as any;

            if (errorObj.status === "FETCH_ERROR") {
              message = "Cannot connect to server.";
            } else if (errorObj.status === "TIMEOUT_ERROR") {
              message = "Server timeout. Try again later.";
            } else if ("error" in errorObj && errorObj.error?.data?.message) {
              message = errorObj.error.data.message;
            }
          }

          console.error("🚨 Login Error:", message);
        }
      },
    }),

    socialAuth: builder.mutation<LoginResponse, { email: string; name: string; avatar?: string }>({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (err: unknown) {
          let message = "Social Auth failed";

          if (err && typeof err === "object") {
            const errorObj = err as any;

            if (errorObj.status === "FETCH_ERROR") {
              message = "Cannot reach server.";
            } else if (errorObj.status === "TIMEOUT_ERROR") {
              message = "Server timeout. Try again later.";
            } else if ("error" in errorObj && errorObj.error?.data?.message) {
              message = errorObj.error.data.message;
            }
          }

          console.error("🚨 Social Auth Error:", message);
        }
      },
    }),

    logOut: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (err: unknown) {
          let message = "Logout failed";

          if (err && typeof err === "object") {
            const errorObj = err as any;

            if (errorObj.status === "FETCH_ERROR") {
              message = "Cannot reach server.";
            } else if (errorObj.status === "TIMEOUT_ERROR") {
              message = "Server timeout. Try again later.";
            } else if ("error" in errorObj && errorObj.error?.data?.message) {
              message = errorObj.error.data.message;
            }
          }

          console.error("🚨 Logout Error:", message);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogOutMutation,
} = authApi;
