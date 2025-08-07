// src/components/jobs/JobDetails.tsx
"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { Job } from "@/types";
import {
  Building,
  Calendar,
  CheckCircle,
  DollarSign,
  MapPin,
  Users,
  X,
} from "lucide-react";
import React from "react";

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply: (job: Job) => void;
  isAuthenticated: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  onClose,
  onApply,
  isAuthenticated,
}) => {
  const handleApply = () => {
    onApply(job);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close job details"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Job header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Building className="w-5 h-5 mr-3" />
                  <span className="font-medium">{job.company}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>{job.location}</span>
                </div>

                <div className="flex items-center text-green-600">
                  <DollarSign className="w-5 h-5 mr-3" />
                  <span className="font-medium">{job.salary}</span>
                </div>

                <div className="flex items-center text-gray-500">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Posted on {formatDate(job.postedDate)}</span>
                  <span className="ml-2 text-sm">
                    ({formatRelativeDate(job.postedDate)})
                  </span>
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <div className="lg:ml-6">
                <Button
                  size="lg"
                  onClick={handleApply}
                  className="w-full lg:w-auto"
                >
                  Apply for this job
                </Button>
              </div>
            )}
          </div>

          {/* Job description */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Job Description
              </h3>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Requirements
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Company info placeholder */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                About {job.company}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Building className="w-8 h-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-3">
                    {job.company} is a leading company in their industry,
                    committed to innovation and providing excellent
                    opportunities for professional growth.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>51-200 employees</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h4 className="text-lg font-medium text-blue-900 mb-2">
                Ready to apply?
              </h4>
              <p className="text-blue-700 mb-4">
                Login or create an account to apply for this position and track
                your applications.
              </p>
              <div className="space-x-3">
                <Button variant="outline">Login</Button>
                <Button>Create Account</Button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isAuthenticated && <Button onClick={handleApply}>Apply Now</Button>}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
