// src/components/JobBoardPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { initializeAuth } from "@/lib/redux/slices/authSlice";
import { Job } from "@/types";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import JobDetails from "@/components/jobs/JobDetails";
import ApplicationForm from "@/components/jobs/ApplicationForm";
import AuthModal from "@/components/auth/AuthModal";

const JobBoardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage on component mount
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobApply = (job: Job) => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setApplicationJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  const handleCloseApplicationForm = () => {
    setApplicationJob(null);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover amazing opportunities from top companies around the world.
        </p>
      </div>

      {/* Job filters */}
      <JobFilters />

      {/* Job list */}
      <JobList
        onJobSelect={handleJobSelect}
        onJobApply={handleJobApply}
        isAuthenticated={isAuthenticated}
      />

      {/* Job details modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={handleCloseJobDetails}
          onApply={handleJobApply}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Application form modal */}
      {applicationJob && isAuthenticated && (
        <ApplicationForm
          job={applicationJob}
          onClose={handleCloseApplicationForm}
          userEmail={user?.email}
          userName={user?.name}
        />
      )}

      {/* Auth modal for unauthenticated users */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthSuccess}
        initialMode="login"
      />
    </div>
  );
};

export default JobBoardPage;
