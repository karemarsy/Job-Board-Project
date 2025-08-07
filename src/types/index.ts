// src/types/index.ts

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

export interface JobApplication {
  id?: number;
  jobId: number;
  applicantName: string;
  applicantEmail: string;
  resume: string;
  coverLetter: string;
  appliedDate?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    type: string;
    location: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApplicationState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  submissionStatus: "idle" | "loading" | "success" | "error";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface JobFilters {
  search?: string;
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
}
