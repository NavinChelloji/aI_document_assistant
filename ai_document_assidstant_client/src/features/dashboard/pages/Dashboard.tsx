import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Folder, FileText, MessageSquare, HardDrive, ChevronRight, CheckCircle2 } from "lucide-react";
import { workspaceService } from "../../workspace/services/workspace.api";
import { useWorkspaceStore } from "../../../store/workspace.store";
import { Button } from "../../../ui/button/Button";
import { Card } from "../../../ui/card/Card";
import { useAbortController } from "../../../hooks/useAbortController";

export const Dashboard = () => {
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const [isLoading, setIsLoading] = useState(false);
  const { getSignal } = useAbortController();

  useEffect(() => {
    // Mocking for UI demonstration based on mockup
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center space-x-2">
             <span>Welcome back, John!</span>
             <span role="img" aria-label="wave">👋</span>
          </h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your documents.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="p-4 flex items-center space-x-4 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-purple-600">
               <Folder size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500">Workspaces</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">6</h3>
            </div>
         </Card>
         <Card className="p-4 flex items-center space-x-4 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500">Documents</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">128</h3>
            </div>
         </Card>
         <Card className="p-4 flex items-center space-x-4 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg text-indigo-600">
               <MessageSquare size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500">Chats</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">342</h3>
            </div>
         </Card>
         <Card className="p-4 flex items-center space-x-4 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl relative overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-600 dark:text-gray-400 z-10">
               <HardDrive size={24} />
            </div>
            <div className="z-10">
               <p className="text-sm text-gray-500">Storage</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white text-sm">2.4 <span className="text-xs text-gray-500 font-normal">GB / 10 GB</span></h3>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-blue-600 w-1/4 rounded-r-full"></div>
         </Card>
      </div>

      {/* Recent Workspaces */}
      <div>
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Workspaces</h3>
             <Link to="/workspaces" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                 View all <ChevronRight size={16} className="ml-1" />
             </Link>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
               { id: 1, name: "HR Policies", docs: 24, color: "bg-red-100 text-red-600", letter: "H" },
               { id: 2, name: "Legal", docs: 18, color: "bg-green-100 text-green-600", letter: "L" },
               { id: 3, name: "Finance", docs: 32, color: "bg-teal-100 text-teal-600", letter: "F" },
               { id: 4, name: "Research", docs: 14, color: "bg-blue-100 text-blue-600", letter: "R" },
            ].map((ws) => (
               <Link key={ws.id} to={`/workspace/${ws.id}`}>
                 <Card className="p-4 flex items-center space-x-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-800 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${ws.color}`}>
                       {ws.letter}
                    </div>
                    <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ws.name}</h4>
                       <p className="text-xs text-gray-500">{ws.docs} Documents</p>
                    </div>
                 </Card>
               </Link>
            ))}
         </div>
      </div>

      {/* Recent Documents */}
      <div>
         <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Documents</h3>
             <Link to="/documents" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                 View all <ChevronRight size={16} className="ml-1" />
             </Link>
         </div>
         <div className="space-y-2">
            {[
               { id: 1, name: "Employee_Handbook.pdf", ws: "HR Policies", time: "2 hours ago", status: "Processed" },
               { id: 2, name: "Leave_Policy_2024.pdf", ws: "HR Policies", time: "1 day ago", status: "Processed" },
               { id: 3, name: "Service_Agreement.docx", ws: "Legal", time: "2 days ago", status: "Processed" },
            ].map((doc) => (
               <div key={doc.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                     <FileText className="text-red-500 w-8 h-8" />
                     <div>
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">{doc.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center">
                           <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                           {doc.ws} <span className="mx-2">•</span> Uploaded {doc.time}
                        </p>
                     </div>
                  </div>
                  <div>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {doc.status}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};
