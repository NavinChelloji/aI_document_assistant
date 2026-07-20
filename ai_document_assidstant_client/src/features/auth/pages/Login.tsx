import React from 'react';
import { Bot, Mail, Lock } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { Input } from '../../../ui/input/Input';

const Login = () => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-blue-50 p-12 flex flex-col items-start justify-center relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">AI Document Assistant</span>
        </div>
        <h2 className="text-xl font-medium text-gray-700 mb-2">Upload your documents.</h2>
        <p className="text-gray-500 mb-8">Chat with them. Get accurate answers with citations.</p>
        
        {/* Abstract shapes / illustration placeholder */}
        <div className="mt-8 flex justify-center w-full">
          <div className="relative">
             <Bot className="h-32 w-32 text-blue-600 relative z-10" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            Welcome Back! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              icon={<Mail className="h-4 w-4" />}
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>
            <Input 
              type="password" 
              placeholder="Enter your password" 
              icon={<Lock className="h-4 w-4" />}
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <Button fullWidth size="lg" className="mt-6 rounded-xl">
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
