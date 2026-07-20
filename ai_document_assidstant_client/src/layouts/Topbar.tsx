import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from '../ui/input/Input';

export const Topbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-md">
          <Input 
            icon={<Search className="h-4 w-4" />} 
            placeholder="Search anything..." 
            className="bg-gray-50 border-gray-200 rounded-full h-10"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            JD
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
        </div>
      </div>
    </header>
  );
};
