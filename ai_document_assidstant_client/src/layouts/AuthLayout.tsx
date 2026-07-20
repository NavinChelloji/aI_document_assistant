import * as React from "react"
import { Outlet } from "react-router-dom"
import { Bot } from "lucide-react"

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center items-center bg-blue-50 dark:bg-blue-900/20 p-12 relative overflow-hidden">
        <div className="absolute top-8 left-8 flex items-center space-x-3">
           <div className="bg-blue-600 p-2 rounded-lg text-white">
             <Bot size={24} />
           </div>
           <span className="text-xl font-bold text-gray-900 dark:text-white">AI Document<br/>Assistant</span>
        </div>
        
        <div className="max-w-md mt-16 text-left w-full z-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload your documents.<br/>
            Chat with them. Get accurate<br/>
            answers with citations.
          </h1>
          {/* Placeholder for Robot Illustration */}
          <div className="mt-12 flex justify-center w-full bg-blue-100/50 dark:bg-blue-800/30 p-12 rounded-3xl relative h-64 border border-blue-200 dark:border-blue-700/50 backdrop-blur-sm">
             <div className="text-blue-500 font-semibold flex items-center space-x-2">
                 <Bot size={48} className="animate-bounce" />
                 <span>AI Core</span>
             </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-800/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-50"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm lg:w-96 shadow-xl dark:shadow-2xl-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 relative z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
