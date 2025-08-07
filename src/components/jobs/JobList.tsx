// src/components/jobs/JobList.tsx
"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchJobs, setPage } from "@/lib/redux/slices/jobSlice";
import { Job } from "@/types";
import JobCard from "./JobCard";
import { LoadingState, SkeletonCard } from "@/components/ui/Loading";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

interface JobListProps {
  onJobSelect: (job: Job) => void;
  onJobApply: (job: Job) => void;
  isAuthenticated: boolean;
}

const JobList: React.FC<JobListProps> = ({
  onJobSelect,
  onJobApply,
  isAuthenticated,
}) => {
  const dispatch = useAppDispatch();
  const { jobs, loading, error, filters, pagination } = useAppSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(
      fetchJobs({
        search: filters.search,
        type: filters.type,
        location: filters.location,
        page: pagination.page,
        limit: pagination.limit,
      })
    );
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const hasNextPage = pagination.page < totalPages;
  const hasPreviousPage = pagination.page > 1;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Briefcase className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Error loading jobs</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button
          onClick={() =>
            dispatch(
              fetchJobs({
                search: filters.search,
                type: filters.type,
                location: filters.location,
                page: pagination.page,
                limit: pagination.limit,
              })
            )
          }
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No jobs found
        </h3>
        <p className="text-gray-500 mb-6">
          {filters.search || filters.type || filters.location
            ? "Try adjusting your search criteria or filters."
            : "There are no jobs available at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {jobs.length} of {pagination.total} jobs
          {(filters.search || filters.type || filters.location) && (
            <span className="text-blue-600 ml-1">(filtered)</span>
          )}
        </p>
        <p className="text-sm text-gray-500">
          Page {pagination.page} of {totalPages}
        </p>
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onViewDetails={onJobSelect}
            onApply={onJobApply}
            showApplyButton={isAuthenticated}
          />
        ))}
      </div>

      {/* Loading indicator for pagination */}
      {loading && jobs.length > 0 && (
        <LoadingState message="Loading more jobs..." className="py-4" />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!hasPreviousPage || loading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber = Math.max(
                1,
                Math.min(pagination.page - 2 + index, totalPages - 4 + index)
              );

              if (pageNumber > totalPages) return null;

              const isActive = pageNumber === pagination.page;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                  className="min-w-[40px]"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!hasNextPage || loading}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
