// src/lib/redux/slices/authSlice.ts
// ONLY CHANGE: Replace the two 'any' types with proper types

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials, RegisterData, User } from "@/types";
import { authApi } from "@/lib/api/authApi";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (error: unknown) { // CHANGE 1: Replace 'any' with 'unknown'
      const message = error instanceof Error ? error.message : "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: unknown) { // CHANGE 2: Replace 'any' with 'unknown'
      const message = error instanceof Error ? error.message : "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      // Clear user data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    initializeAuth: (state) => {
      // Initialize auth state from localStorage
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (user && isAuthenticated === "true") {
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError, setUser, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;