import * as React from "react"
import { Outlet } from "react-router-dom"
import { Bot } from "lucide-react"

export const AuthLayout = () => {
  return (
    <div className="flex lg:grid lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ── Left panel — hidden on mobile, shown lg+ ── */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center items-center bg-blue-50 dark:bg-blue-900/20 p-12 relative overflow-hidden">
        <div className="absolute top-8 left-8 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Bot size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            AI Document<br />Assistant
          </span>
        </div>

        <div className="max-w-md mt-16 text-left w-full z-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Upload your documents.<br />
            Chat with them. Get accurate<br />
            answers with citations.
          </h1>
          <div className="mt-12 flex justify-center w-full bg-blue-100/50 dark:bg-blue-800/30 p-12 rounded-3xl relative h-64 border border-blue-200 dark:border-blue-700/50 backdrop-blur-sm">
            <div className="text-blue-500 font-semibold flex items-center space-x-2">
              <Bot size={48} className="animate-bounce" />
              <span>AI Core</span>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-800/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-50" />
      </div>

      {/* ── Right panel — form (full screen on mobile) ── */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 py-10 sm:px-6 lg:flex-none lg:px-16 xl:px-24 bg-white dark:bg-gray-900 min-h-screen">

        {/* Mobile logo — only visible below lg */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Bot size={20} />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">AI Document Assistant</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-7 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
