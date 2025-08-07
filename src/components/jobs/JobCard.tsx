// src/components/jobs/JobCard.tsx
"use client";

import React from "react";
import { Job } from "@/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRelativeDate, truncateText } from "@/lib/utils";
import { MapPin, Building, Clock, DollarSign } from "lucide-react";

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply?: (job: Job) => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  showApplyButton = true,
}) => {
  const handleViewDetails = () => {
    onViewDetails(job);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(job);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {job.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
            {job.type}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-1">
          <Building className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{job.company}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.location}</span>
        </div>

        <div className="flex items-center text-blue-500 mb-2">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{job.salary}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 text-sm mb-4">
          {truncateText(job.description, 120)}
        </p>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Key Requirements:
            </p>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center text-gray-400 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>Posted {formatRelativeDate(job.postedDate)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="flex-1"
        >
          View Details
        </Button>
        {showApplyButton && (
          <Button size="sm" onClick={handleApply} className="flex-1">
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
