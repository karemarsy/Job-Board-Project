// src/lib/redux/slices/jobSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { JobState, Job, JobFilters } from "@/types";
import { jobApi } from "@/lib/api/jobApi";

// Async thunks
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (filters: JobFilters = {}, { rejectWithValue }) => {
    try {
      const response = await jobApi.getJobs(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch jobs");
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await jobApi.getJobById(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch job details");
    }
  }
);

// Initial state
const initialState: JobState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    type: "",
    location: "",
  },
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
  },
};

// Job slice
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<typeof initialState.filters>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        type: "",
        location: "",
      };
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs cases
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch job by ID cases
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPage,
  clearCurrentJob,
  clearError,
} = jobSlice.actions;
export default jobSlice.reducer;
