// src/components/jobs/ApplicationForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  submitApplication,
  resetSubmissionStatus,
} from "@/lib/redux/slices/applicationSlice";
import { Job, JobApplication } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const applicationSchema = z.object({
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  applicantEmail: z.string().email("Please enter a valid email address"),
  resume: z
    .string()
    .min(10, "Please provide a brief resume or experience summary"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  job: Job;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  job,
  onClose,
  userEmail,
  userName,
}) => {
  const dispatch = useAppDispatch();
  const { submissionStatus, error } = useAppSelector(
    (state) => state.applications
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantName: userName || "",
      applicantEmail: userEmail || "",
      resume: "",
      coverLetter: "",
    },
  });

  useEffect(() => {
    // Reset submission status when component mounts
    dispatch(resetSubmissionStatus());

    return () => {
      // Clean up on unmount
      dispatch(resetSubmissionStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    // Auto close on successful submission after 3 seconds
    if (submissionStatus === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [submissionStatus, onClose]);

  const onSubmit = async (data: ApplicationFormData) => {
    const applicationData: Omit<JobApplication, "id" | "appliedDate"> = {
      jobId: job.id,
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      resume: data.resume,
      coverLetter: data.coverLetter,
    };

    await dispatch(submitApplication(applicationData));
  };

  // Success state
  if (submissionStatus === "success") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Application Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Your application for <strong>{job.title}</strong> at{" "}
                <strong>{job.company}</strong> has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This window will close automatically in a few seconds.
              </p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Apply for Position
            </h2>
            <p className="text-sm text-gray-600">
              {job.title} at {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close application form"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Submission Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register("applicantName")}
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.applicantName?.message}
                autoComplete="name"
              />

              <Input
                {...register("applicantEmail")}
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                error={errors.applicantEmail?.message}
                autoComplete="email"
              />
            </div>

            <Textarea
              {...register("resume")}
              label="Resume / Experience Summary"
              placeholder="Please provide a brief summary of your relevant experience, skills, and qualifications..."
              rows={6}
              error={errors.resume?.message}
              helperText="Include your most relevant experience, skills, and achievements"
            />

            <Textarea
              {...register("coverLetter")}
              label="Cover Letter"
              placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
              rows={8}
              error={errors.coverLetter?.message}
              helperText="Explain your motivation and how your background aligns with this role"
            />

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Application Summary
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Position:</strong> {job.title}
                </p>
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Type:</strong> {job.type}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submissionStatus === "loading"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submissionStatus === "loading"}
                disabled={submissionStatus === "loading"}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
