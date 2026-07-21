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
      const result = await authService.login(data, getSignal());
      login({ email: data.email, full_name: result?.full_name });
      navigate("/dashboard");
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
      <div className="text-left mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>Welcome Back!</span>
          <span role="img" aria-label="wave">👋</span>
        </h3>
        <p className="text-sm text-gray-500 mt-2">Sign in to continue</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-[var(--color-error-600)] bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}
        <Input
          label="Email address"
          placeholder="Enter your email"
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
        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-[var(--text-default)]">Password</label>
             <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
               Forgot password?
             </Link>
          </div>
          <Input
            placeholder="Enter your password"
            type="password"
            error={errors.password?.message}
            {...register("password", { 
              required: "Password is required" 
            })}
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Remember me
          </label>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 text-white" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
      <div className="text-center text-sm pt-4">
        <span className="text-[var(--text-muted)]">Don't have an account? </span>
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </Link>
      </div>
    </div>
  );
};
