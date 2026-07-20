import React, { useState, useRef } from "react";
import { Upload as UploadIcon, File, X, AlertCircle } from "lucide-react";
import { Button } from "../../../ui/button/Button";
import { documentService } from "../services/document.api";
import { useAbortController } from "../../../hooks/useAbortController";

// Assuming we pass workspaceId as a prop or get it from context/url
export const Upload = ({ workspaceId, onUploadSuccess }: { workspaceId: number, onUploadSuccess?: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getSignal } = useAbortController();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported at this time.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await documentService.uploadDocument(workspaceId, file, getSignal());
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError(err.response?.data?.detail || "Failed to upload document. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-500)]/10' : 'border-[var(--border-default)] hover:border-[var(--text-muted)] bg-[var(--bg-subtle)]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-[var(--bg-surface)] rounded-full shadow-sm">
              <UploadIcon className="w-8 h-8 text-[var(--color-primary-500)]" />
            </div>
            <div>
              <p className="text-lg font-medium text-[var(--text-default)]">Drag & drop your PDF here</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">or click to browse from your computer</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center p-4 bg-[var(--bg-surface)] rounded-lg shadow-sm w-full max-w-md border border-[var(--border-default)]">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg mr-4">
                <File className="w-6 h-6 text-[var(--color-error-600)]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-[var(--text-default)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="p-1 hover:bg-[var(--bg-subtle)] rounded-full transition-colors ml-4 text-[var(--text-muted)] hover:text-[var(--text-default)]"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Button 
              onClick={handleUpload} 
              isLoading={isUploading}
              className="w-full max-w-md"
            >
              {isUploading ? "Uploading & Processing..." : "Upload to Workspace"}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center p-4 bg-red-50 dark:bg-red-900/20 text-[var(--color-error-600)] rounded-lg border border-[var(--color-error-600)]/20">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
