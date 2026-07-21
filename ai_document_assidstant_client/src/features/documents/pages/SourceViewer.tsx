import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, HelpCircle, FileText } from 'lucide-react';

export const SourceViewer = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1400px] mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center px-4 shrink-0">
         <div className="flex items-center space-x-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
               Leave_Policy_2024.pdf
            </h2>
         </div>

         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1">
               <input type="text" value="5" readOnly className="w-8 text-center bg-transparent border-none focus:ring-0 text-sm font-medium p-0" />
               <span className="text-gray-500 text-sm">/ 24</span>
            </div>
            
            <div className="flex items-center space-x-1 border-l border-gray-300 dark:border-gray-700 pl-6">
               <button className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ZoomOut className="w-4 h-4" />
               </button>
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-center">110%</span>
               <button className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ZoomIn className="w-4 h-4" />
               </button>
            </div>
         </div>

         <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
               <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
               <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
               <HelpCircle className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Left Sidebar - Thumbnails */}
         <div className="w-48 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto p-4 space-y-4 hidden md:block">
            {[3, 4, 5, 6].map((page) => (
               <div key={page} className="flex flex-col items-center">
                  <div className={`w-32 h-40 bg-white dark:bg-gray-800 shadow-sm border ${page === 5 ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'} rounded flex items-center justify-center p-2 mb-2 cursor-pointer transition-all hover:shadow-md`}>
                     {/* Mock PDF Thumbnail content */}
                     <div className="w-full h-full border border-gray-100 dark:border-gray-700 p-2 space-y-1">
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-3/4"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-5/6"></div>
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full mt-2"></div>
                        {page === 5 && <div className="h-1 bg-yellow-300 w-2/3"></div>}
                     </div>
                  </div>
                  <span className={`text-xs ${page === 5 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{page}</span>
               </div>
            ))}
         </div>

         {/* Main Reading Area */}
         <div className="flex-1 bg-gray-200/50 dark:bg-black/20 overflow-y-auto flex justify-center p-8">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 rounded p-12 min-h-[1000px] text-gray-800 dark:text-gray-200 font-serif leading-relaxed">
               <h3 className="text-2xl font-bold mb-6 font-sans">5.2 Casual Leave</h3>
               <p className="mb-4">
                  <span className="bg-yellow-200 dark:bg-yellow-900/50 px-1 py-0.5 rounded text-gray-900 dark:text-yellow-100 font-medium">Employees are entitled to 12 casual leaves in a year.</span>
               </p>
               <p className="mb-8">
                  These leaves can be availed for personal work or emergencies. Leaves must be applied at least one day in advance.
               </p>

               <h3 className="text-2xl font-bold mb-6 font-sans mt-12">5.3 Sick Leave</h3>
               <p className="mb-4">
                  Employees are entitled to 10 sick leaves in a year upon submission of valid medical certificate.
               </p>
            </div>
         </div>

         {/* Right Sidebar - Relevant Chunk */}
         <div className="w-72 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Relevant Chunk</h3>
            
            <div className="flex-1">
               <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <span className="font-medium">Employees are entitled to 12 casual leaves in a year.</span> These leaves can be availed for personal work or emergencies.
               </p>
               <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-wider">Page 5</p>
            </div>
         </div>
      </div>
    </div>
  );
};
