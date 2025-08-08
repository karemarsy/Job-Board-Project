// src/lib/redux/slices/applicationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ApplicationState, JobApplication } from "@/types";
import { applicationApi } from "@/lib/api/applicationApi";

// Async thunks
export const submitApplication = createAsyncThunk(
  "applications/submitApplication",
  async (
    applicationData: Omit<JobApplication, "id" | "appliedDate">,
    { rejectWithValue }
  ) => {
    try {
      const response = await applicationApi.submitApplication(applicationData);
      return response;
    } catch (error: unknown) { // CHANGE: Replace 'any' with 'unknown'
      const message = error instanceof Error ? error.message : "Failed to submit application";
      return rejectWithValue(message);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  "applications/fetchUserApplications",
  async (userEmail: string, { rejectWithValue }) => {
    try {
      const response = await applicationApi.getUserApplications(userEmail);
      return response;
    } catch (error: unknown) { // CHANGE: Replace 'any' with 'unknown'
      const message = error instanceof Error ? error.message : "Failed to fetch applications";
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState: ApplicationState = {
  applications: [],
  loading: false,
  error: null,
  submissionStatus: "idle",
};

// Application slice
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    resetSubmissionStatus: (state) => {
      state.submissionStatus = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit application cases
      .addCase(submitApplication.pending, (state) => {
        state.submissionStatus = "loading";
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.submissionStatus = "success";
        state.applications.push(action.payload);
        state.error = null;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.submissionStatus = "error";
        state.error = action.payload as string;
      })
      // Fetch user applications cases
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSubmissionStatus, clearError, clearApplications } =
  applicationSlice.actions;
export default applicationSlice.reducer;
