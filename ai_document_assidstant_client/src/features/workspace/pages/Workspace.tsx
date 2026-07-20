import React from 'react';
import { ArrowLeft, Upload, MessageSquare, FileText, Settings, Activity, File as FileIcon, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { Card } from '../../../ui/card/Card';

const Workspace = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-8">
      {/* Left Sidebar - Workspace Nav */}
      <div className="w-56 space-y-6">
        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 px-3">HR Policies</h2>
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-lg">
              <Activity className="mr-3 h-5 w-5" />
              Overview
            </a>
            <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              <FileText className="mr-3 h-5 w-5" />
              Documents
            </a>
            <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              <MessageSquare className="mr-3 h-5 w-5" />
              Chats
            </a>
            <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8 overflow-y-auto pr-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Policies</h1>
          <p className="text-gray-500 mt-1">24 Documents • 2.1 GB</p>
          <p className="text-gray-600 mt-4 max-w-2xl">All HR related policies, guidelines and manuals.</p>
          
          <div className="flex gap-4 mt-6">
            <Button className="rounded-lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" className="rounded-lg bg-white">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Top Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Documents</h2>
            <Button variant="ghost" className="text-sm text-blue-600 h-auto p-0 hover:bg-transparent hover:text-blue-700">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
          
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {[
                { name: 'Employee_Handbook.pdf', time: 'Uploaded 2 hours ago', size: '4.2 MB', icon: 'text-red-500' },
                { name: 'Leave_Policy_2024.pdf', time: 'Uploaded 1 day ago', size: '2.1 MB', icon: 'text-red-500' },
                { name: 'Code_of_Conduct.pdf', time: 'Uploaded 3 days ago', size: '1.8 MB', icon: 'text-red-500' },
                { name: 'Performance_Review_Guide.pdf', time: 'Uploaded 5 days ago', size: '3.5 MB', icon: 'text-red-500' },
                { name: 'Travel_Policy.pdf', time: 'Uploaded 1 week ago', size: '2.7 MB', icon: 'text-red-500' },
              ].map((doc) => (
                <div key={doc.name} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-2 rounded-lg">
                      <FileIcon className={`h-6 w-6 ${doc.icon}`} />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-gray-500">
                    <span className="w-40 hidden md:inline-block">{doc.time}</span>
                    <span className="w-16 text-right">{doc.size}</span>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
