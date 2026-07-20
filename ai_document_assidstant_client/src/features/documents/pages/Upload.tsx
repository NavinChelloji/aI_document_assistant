import React, { useState } from 'react';
import { ArrowLeft, UploadCloud, File as FileIcon, X, CheckCircle2, Loader2, FileText, LayoutGrid, Database, Save } from 'lucide-react';
import { Button } from '../../../ui/button/Button';
import { Card, CardContent } from '../../../ui/card/Card';

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isProcessing ? 'Processing Documents' : 'Upload Documents'}
        </h1>
      </div>

      {!isProcessing ? (
        <>
          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-12 text-center hover:bg-gray-100 transition-colors">
            <div className="bg-white h-16 w-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & drop documents here</h3>
            <p className="text-gray-500 mb-6">or</p>
            <Button onClick={() => setIsProcessing(true)}>Browse Files</Button>
            <p className="text-sm text-gray-400 mt-6">
              Supported formats: PDF, DOCX, TXT, PPTX, XLSX, PNG, JPG
            </p>
          </div>

          {/* Upload Queue */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4 px-1">Upload Queue</h3>
            <Card>
              <div className="divide-y divide-gray-100">
                {[
                  { name: 'Employee_Handbook.pdf', size: '2.4 MB', progress: 100, status: 'done', icon: 'text-red-500' },
                  { name: 'Leave_Policy_2024.pdf', size: '1.8 MB', progress: 100, status: 'done', icon: 'text-red-500' },
                  { name: 'Onboarding_Process.docx', size: '3.2 MB', progress: 60, status: 'uploading', icon: 'text-blue-500' },
                  { name: 'Code_of_Conduct.pdf', size: '2.1 MB', progress: 0, status: 'pending', icon: 'text-red-500' },
                ].map((doc) => (
                  <div key={doc.name} className="p-4 flex items-center gap-4">
                    <FileIcon className={`h-8 w-8 ${doc.icon} bg-gray-50 p-1.5 rounded-lg`} />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-900">{doc.name}</span>
                        <span className="text-xs font-medium text-gray-500">{doc.size}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${doc.status === 'done' ? 'bg-green-500' : 'bg-blue-600'}`}
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8 text-right">
                          {doc.status === 'pending' ? 'Pending' : `${doc.progress}%`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-6 flex justify-end">
                      {doc.status === 'done' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {doc.status === 'uploading' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                      {doc.status === 'pending' && <button className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-500 mb-8 -mt-4">We are extracting text and preparing your document for AI chat.</p>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Steps */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-8 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <FileIcon className="h-6 w-6 text-red-500" />
                <span className="font-semibold text-blue-900">Employee_Handbook.pdf</span>
              </div>
              
              <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                {/* Step 1 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] bg-green-500 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 absolute" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">Uploaded</h4>
                    <p className="text-sm text-gray-500">File uploaded successfully</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] bg-green-500 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 absolute" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">Extracting Text</h4>
                    <p className="text-sm text-gray-500">Extracting text from document</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] bg-blue-600 h-4 w-4 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 flex items-center gap-2">Chunking</h4>
                    <p className="text-sm text-blue-600/80">Splitting into small chunks</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-6 opacity-50">
                  <div className="absolute -left-[9px] bg-gray-200 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Generating Embeddings</h4>
                    <p className="text-sm text-gray-500">Creating embeddings for each chunk</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative pl-6 opacity-50">
                  <div className="absolute -left-[9px] bg-gray-200 h-4 w-4 rounded-full border-4 border-white shadow-sm"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Saving to Vector Database</h4>
                    <p className="text-sm text-gray-500">Storing embeddings in database</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation / Graphic */}
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="text-center space-y-6 relative z-10">
                <FileText className="h-20 w-20 text-gray-300 mx-auto" />
                <div className="space-y-2">
                  <p className="text-gray-500 font-medium">Please wait while we process your document...</p>
                  <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-blue-600 w-3/4 rounded-full relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">75%</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 mt-0.5"><Database className="h-4 w-4" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Tip: You can close this page.</h4>
                    <p className="text-xs text-blue-700">We'll notify you when it's ready.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Upload;
