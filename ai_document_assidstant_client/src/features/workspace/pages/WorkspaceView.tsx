import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  MessageSquarePlus,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Activity,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../ui/button/Button';

export const WorkspaceView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Documents', icon: FileText },
    { name: 'Chats', icon: MessageSquare },
    { name: 'Activity', icon: Activity },
    { name: 'Settings', icon: Settings },
  ];

  const topDocuments = [
    { id: 1, name: "Employee_Handbook.pdf", time: "2 hours ago", size: "4.2 MB" },
    { id: 2, name: "Leave_Policy_2024.pdf", time: "1 day ago", size: "2.1 MB" },
    { id: 3, name: "Code_of_Conduct.pdf", time: "3 days ago", size: "1.8 MB" },
    { id: 4, name: "Performance_Review_Guide.pdf", time: "5 days ago", size: "3.5 MB" },
    { id: 5, name: "Travel_Policy.pdf", time: "1 week ago", size: "2.7 MB" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-100 dark:border-gray-800 p-4 space-y-6">
        <div>
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">HR Policies</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.name
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">HR Policies</h1>
            <p className="text-gray-500 mt-2">24 Documents • 2.1 GB</p>
            <p className="text-sm text-gray-400 mt-1">All HR related policies, guidelines and manuals.</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
               <UploadCloud className="w-4 h-4 mr-2" />
               Upload Document
            </Button>
            <Button variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
               <MessageSquarePlus className="w-4 h-4 mr-2" />
               New Chat
            </Button>
          </div>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'Overview' && (
          <div>
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Documents</h3>
                 <Link to={`/workspaces/${id}/documents`} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                     View all <ChevronRight size={16} className="ml-1" />
                 </Link>
             </div>
             
             <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                   {topDocuments.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                         <div className="flex items-center space-x-4">
                            <FileText className="text-red-500 w-6 h-6" />
                            <span className="font-medium text-sm text-gray-900 dark:text-white">{doc.name}</span>
                         </div>
                         <div className="flex items-center text-sm text-gray-500 space-x-8">
                            <span>Uploaded {doc.time}</span>
                            <span className="w-16 text-right">{doc.size}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                         </div>
                      </li>
                   ))}
                </ul>
             </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== 'Overview' && (
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{activeTab} Content</h3>
              <p className="text-gray-500">Coming soon in future iterations.</p>
           </div>
        )}
      </div>
    </div>
  );
};
