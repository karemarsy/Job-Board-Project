// src/components/auth/LoginForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser, clearError } from "@/lib/redux/slices/authSlice";
import { LoginCredentials } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());

    return () => {
      // Clear errors when component unmounts
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginCredentials) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      reset();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <p className="text-gray-600 text-center">
          Enter your credentials to access your account
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
            autoComplete="current-password"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={loading}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Demo credentials:</strong>
            <br />
            Email: demo@example.com
            <br />
            Password: password123
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
