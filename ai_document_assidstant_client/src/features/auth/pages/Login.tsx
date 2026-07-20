import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../../store/auth.store";
import { authService } from "../services/auth.api";

interface LoginCredentials {
  email: string;
  password?: string;
}
import { Button } from "../../../ui/button/Button";
import { Input } from "../../../ui/input/Input";
import { useAbortController } from "../../../hooks/useAbortController";

export const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const { getSignal } = useAbortController();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setError("");
    setIsLoading(true);

    try {
      await authService.login(data, getSignal());
      login(); // Update global auth state
      navigate("/"); // Redirect to dashboard
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.response?.data?.detail || "Failed to log in. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-[var(--text-default)]">Sign in to your account</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-[var(--color-error-600)] bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}
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
            required: "Password is required" 
          })}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-[var(--text-muted)]">Don't have an account? </span>
        <Link to="/register" className="font-medium text-[var(--color-primary-600)] hover:text-[var(--color-primary-500)]">
          Sign up
        </Link>
      </div>
    </div>
  );
};
