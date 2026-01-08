import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";
import type { User } from "./authSlice";

// Response types
type RegistrationResponse = {
  message: string;
  activationToken: string;
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
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (err: unknown) {
          let message = "Registration failed";
          if (err && typeof err === "object" && "error" in err) {
            const error = err as { error?: { data?: { message?: string } } };
            message = error.error?.data?.message || message;
          }
          console.error(message);
        }
      },
    }),

    activation: builder.mutation<ActivationResponse, { 
      activation_token: string; 
      activation_code: string; 
    }>({
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
          if (err && typeof err === "object" && "error" in err) {
            const error = err as { error?: { data?: { message?: string } } };
            message = error.error?.data?.message || message;
          }
          console.error(message);
        }
      },
    }),

    socialAuth: builder.mutation<LoginResponse, { 
      email: string; 
      name: string; 
      avatar?: string; 
    }>({
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
          console.log("🔴 Social Auth Full Error Object:", err);
          
          let message = "Social Auth failed";
          
          if (err && typeof err === "object") {
            // Check for specific RTK Query error structure
            if ("error" in err) {
              const rtkError = err as { 
                error?: { 
                  status?: number;
                  data?: { message?: string };
                  name?: string;
                } 
              };
              
              console.log("RTK Error Details:", {
                status: rtkError.error?.status,
                data: rtkError.error?.data,
                name: rtkError.error?.name
              });
              
              if (rtkError.error?.name === "FETCH_ERROR") {
                message = "Network error - cannot reach server";
                console.error("⚠️ Network Issue Detected");
                console.error("Check:", {
                  serverUrl: process.env.NEXT_PUBLIC_SERVER_URI,
                  fullUrl: `${process.env.NEXT_PUBLIC_SERVER_URI}social-auth`,
                  suggestion: "Try removing trailing slash from URL"
                });
              } 
              else if (rtkError.error?.status === 404) {
                message = "Endpoint not found (404)";
              }
              else if (rtkError.error?.status === 500) {
                message = "Server error (500)";
              }
              else if (rtkError.error?.data?.message) {
                message = rtkError.error.data.message;
              }
              else if (rtkError.error?.status) {
                message = `Error ${rtkError.error.status}`;
              }
            }
          }
          
          console.error("Social Auth Error:", message);
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
          if (err && typeof err === "object" && "error" in err) {
            const error = err as { error?: { data?: { message?: string } } };
            message = error.error?.data?.message || message;
          }
          console.error(message);
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