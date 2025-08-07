// src/lib/api/applicationApi.ts
import { JobApplication } from '@/types';

const API_BASE_URL = 'http://localhost:3001';

export const applicationApi = {
  async submitApplication(applicationData: Omit<JobApplication, 'id' | 'appliedDate'>): Promise<JobApplication> {
    try {
      const newApplication = {
        ...applicationData,
        appliedDate: new Date().toISOString(),
      };
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApplication),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      const application = await response.json();
      return application;
    } catch (error) {
      throw error;
    }
  },

  async getUserApplications(userEmail: string): Promise<JobApplication[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications?applicantEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const applications = await response.json();
      return applications;
    } catch (error) {
      throw error;
    }
  },

  async checkIfUserApplied(jobId: number, userEmail: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications?jobId=${jobId}&applicantEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to check application status');
      }
      
      const applications = await response.json();
      return applications.length > 0;
    } catch (error) {
      return false; // Return false on error to allow application
    }
  },
};