"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearError, registerUser } from "@/lib/redux/slices/authSlice";
import { RegisterData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());

    return () => {
      // Clear errors when component unmounts
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      reset();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create Account
        </h2>
        <p className="text-gray-600 text-center">
          Sign up to start applying for jobs
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Input
            {...register("name")}
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.name?.message}
            autoComplete="name"
          />

          <Input
            {...register("email")}
            type="email"
            label="Email"
            placeholder="Enter your email"
            error={errors.email?.message}
            autoComplete="email"
          />

          <Input
            {...register("password")}
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            autoComplete="new-password"
          />

          <Input
            {...register("confirmPassword")}
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
