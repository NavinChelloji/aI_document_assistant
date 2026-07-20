import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.api";

interface RegisterData {
  name: string;
  email: string;
  password?: string;
}
import { Button } from "../../../ui/button/Button";
import { Input } from "../../../ui/input/Input";
import { useAbortController } from "../../../hooks/useAbortController";

export const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { getSignal } = useAbortController();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    setError("");
    setIsLoading(true);

    try {
      await authService.register(data, getSignal());
      navigate("/login"); 
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.response?.data?.detail || "Failed to register.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-[var(--text-default)]">Create an account</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-[var(--color-error-600)] bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Full Name"
          type="text"
          error={errors.name?.message}
          {...register("name", { 
            required: "Full Name is required" 
          })}
        />
        <Input
          label="Email address"
          type="email"
          error={errors.email?.message}
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Register
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-[var(--text-muted)]">Already have an account? </span>
        <Link to="/login" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
          Sign in
        </Link>
      </div>
    </div>
  );
};
