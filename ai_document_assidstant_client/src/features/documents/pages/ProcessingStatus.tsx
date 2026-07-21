import React from 'react';
import { FileText, CheckCircle2, Loader2, Info } from 'lucide-react';

export const ProcessingStatus = () => {
  const steps = [
    { title: "Uploaded", description: "File uploaded successfully", status: "complete" },
    { title: "Extracting Text", description: "Extracting text from document", status: "complete" },
    { title: "Chunking", description: "Splitting into small chunks", status: "current" },
    { title: "Generating Embeddings", description: "Creating embeddings for each chunk", status: "pending" },
    { title: "Saving to Vector Database", description: "Storing embeddings in database", status: "pending" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Processing Documents</h1>
        <p className="text-gray-500">We are extracting text and preparing your document for AI chat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Left Side - Stepper */}
         <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
               <FileText className="text-blue-500 w-6 h-6" />
               <span className="font-semibold text-gray-900 dark:text-white">Employee_Handbook.pdf</span>
            </div>

            <div className="relative space-y-8">
               {/* Vertical Line */}
               <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-gray-100 dark:bg-gray-800"></div>

               {steps.map((step, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                     <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 ${
                        step.status === 'complete' ? 'text-green-500' :
                        step.status === 'current' ? 'text-blue-500' : 'text-gray-300 dark:text-gray-700'
                     }`}>
                        {step.status === 'complete' ? (
                           <CheckCircle2 className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full" />
                        ) : step.status === 'current' ? (
                           <Loader2 className="w-8 h-8 animate-spin bg-white dark:bg-gray-900 rounded-full" />
                        ) : (
                           <div className="w-4 h-4 rounded-full border-2 border-current bg-white dark:bg-gray-900"></div>
                        )}
                     </div>
                     <div>
                        <h4 className={`text-sm font-bold ${
                           step.status === 'complete' || step.status === 'current' 
                           ? 'text-gray-900 dark:text-white' 
                           : 'text-gray-400'
                        }`}>{step.title}</h4>
                        <p className={`text-xs mt-1 ${
                           step.status === 'complete' || step.status === 'current' 
                           ? 'text-gray-500' 
                           : 'text-gray-400'
                        }`}>{step.description}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right Side - Visual Status */}
         <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-24 h-24 text-gray-300 dark:text-gray-700 mb-8" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Please wait while we process your document...</h3>
            
            <div className="w-full max-w-sm mt-8 mb-12">
               <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[75%] transition-all duration-500"></div>
               </div>
               <p className="text-right text-xs font-medium text-gray-500 mt-2">75%</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-start text-sm text-left max-w-sm w-full">
               <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
               <div>
                  <span className="font-semibold block mb-1">Tip: You can close this page.</span>
                  We'll notify you when it's ready.
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
