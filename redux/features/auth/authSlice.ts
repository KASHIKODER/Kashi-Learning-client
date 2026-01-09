import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Export the User interface
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string | { public_id?: string; url?: string };
  role?: string;
  isVerified?: boolean;
  courses?: Array<{ courseId: string }>;
}

interface AuthState {
  token: string;
  user: User | null;
}

// Load initial state from localStorage if available
const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { token: "", user: null };
  }
  
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  return {
    token: storedToken || "",
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.token = action.payload.accessToken;
      
      // Transform avatar if it's an object
      const user = { ...action.payload.user };
      if (user.avatar && typeof user.avatar === 'object' && user.avatar.url) {
        user.avatar = user.avatar.url;
      }
      
      state.user = user;
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    // ✅ ADD THIS: Update user action
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
  },
});

// ✅ Export updateUser along with other actions
export const { 
  userRegistration, 
  userLoggedIn, 
  userLoggedOut, 
  setToken,
  updateUser
} = authSlice.actions;
export default authSlice.reducer;