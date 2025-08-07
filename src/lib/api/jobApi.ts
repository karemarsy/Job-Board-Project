// src/lib/api/jobApi.ts
import { Job, JobFilters } from '@/types';

const API_BASE_URL = 'http://localhost:3001';

export const jobApi = {
  async getJobs(filters: JobFilters = {}): Promise<{ jobs: Job[]; total: number }> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.page) {
        params.append('_page', filters.page.toString());
      }
      
      if (filters.limit) {
        params.append('_limit', filters.limit.toString());
      }
      
      // For search, we'll filter on the client side since json-server 
      // doesn't support complex text search across multiple fields
      const url = `${API_BASE_URL}/jobs?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      let jobs: Job[] = await response.json();
      
      // Apply client-side filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.type && filters.type !== '') {
        jobs = jobs.filter(job => job.type === filters.type);
      }
      
      if (filters.location && filters.location !== '') {
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Apply pagination after filtering
      const page = filters.page || 1;
      const limit = filters.limit || 6;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const total = jobs.length;
      const paginatedJobs = jobs.slice(startIndex, endIndex);
      
      return {
        jobs: paginatedJobs,
        total,
      };
    } catch (error) {
      throw error;
    }
  },

  async getJobById(id: number): Promise<Job> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Job not found');
        }
        throw new Error('Failed to fetch job details');
      }
      
      const job = await response.json();
      return job;
    } catch (error) {
      throw error;
    }
  },
};