import React, { useState } from 'react';
import { ArrowLeft, CloudUpload, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../ui/button/Button';

export const UploadDocuments = () => {
  const [uploadQueue, setUploadQueue] = useState([
    { id: 1, name: "Employee_Handbook.pdf", size: "2.4 MB", progress: 100, status: "complete" },
    { id: 2, name: "Leave_Policy_2024.pdf", size: "1.8 MB", progress: 100, status: "complete" },
    { id: 3, name: "Onboarding_Process.docx", size: "3.2 MB", progress: 60, status: "uploading" },
    { id: 4, name: "Code_of_Conduct.pdf", size: "2.1 MB", progress: 0, status: "pending" },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link to="/documents" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Upload Documents
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
      </div>

      {/* Dropzone */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-12">
         <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drag & drop documents here</h3>
         <p className="text-gray-500 mb-4">or</p>
         <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">Browse Files</Button>
         <p className="text-sm text-gray-400 mt-6">Supported formats: PDF, DOCX, TXT, PPTX, XLSX, PNG, JPG</p>
      </div>

      {/* Upload Queue */}
      <div>
         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Queue</h3>
         <div className="space-y-4">
            {uploadQueue.map((file) => (
               <div key={file.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-4 flex-1">
                     <FileText className="text-red-500 w-8 h-8 flex-shrink-0" />
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                           <h4 className="font-medium text-sm text-gray-900 dark:text-white">{file.name}</h4>
                           <span className="text-xs font-medium text-gray-500">{file.progress}%</span>
                        </div>
                        <div className="flex items-center space-x-4">
                           <span className="text-xs text-gray-500 w-16">{file.size}</span>
                           <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${file.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                style={{ width: `${file.progress}%` }}
                              ></div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="ml-6 flex-shrink-0 flex items-center justify-center w-8">
                     {file.status === 'complete' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                     {file.status === 'uploading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                     {file.status === 'pending' && <XCircle className="w-5 h-5 text-gray-400 cursor-pointer hover:text-red-500" />}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
