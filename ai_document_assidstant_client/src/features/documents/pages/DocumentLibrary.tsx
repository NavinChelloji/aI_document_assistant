import React from 'react';
import { Search, ChevronDown, LayoutGrid, LayoutList, MoreVertical, FileText, FileBarChart2 } from 'lucide-react';
import { Input } from '../../../ui/input/Input';

export const DocumentLibrary = () => {
  const documents = [
    { id: 1, name: "Employee_Handbook.pdf", workspace: "HR Policies", type: "PDF", size: "4.2 MB", status: "Processed", time: "2 hours ago", icon: FileText, color: "text-red-500" },
    { id: 2, name: "Leave_Policy_2024.pdf", workspace: "HR Policies", type: "PDF", size: "2.1 MB", status: "Processed", time: "1 day ago", icon: FileText, color: "text-red-500" },
    { id: 3, name: "Service_Agreement.docx", workspace: "Legal", type: "DOCX", size: "1.3 MB", status: "Processed", time: "2 days ago", icon: FileText, color: "text-blue-500" },
    { id: 4, name: "Financial_Report_Q1.xlsx", workspace: "Finance", type: "XLSX", size: "2.8 MB", status: "Processed", time: "3 days ago", icon: FileBarChart2, color: "text-green-500" },
    { id: 5, name: "Research_Paper.pdf", workspace: "Research", type: "PDF", size: "3.6 MB", status: "Processed", time: "5 days ago", icon: FileText, color: "text-red-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
        
        <div className="flex items-center space-x-4">
           {/* Filters */}
           <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <span>All Types</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
           </div>
           <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <span>All Status</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
           </div>

           {/* View Toggles */}
           <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button className="p-1.5 rounded-md bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white">
                 <LayoutList className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                 <LayoutGrid className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      <div className="mb-6 w-full max-w-md">
         <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
               type="text" 
               placeholder="Search documents..." 
               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
         </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
               <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspace</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
               </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
               {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                     <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                           <doc.icon className={`w-5 h-5 mr-3 ${doc.color}`} />
                           <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc.workspace}</span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{doc.type}</span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">{doc.size}</span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                           {doc.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.time}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
