import React, { useState, useRef, useCallback } from "react";
import { Upload as UploadIcon, File, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { documentService } from "../services/document.api";
import { useAbortController } from "../../../hooks/useAbortController";

interface FileItem {
  file: File;
  id: string;
  progress: number;
  status: "idle" | "uploading" | "done" | "error";
  error?: string;
}

interface Props {
  workspaceId: string;
  onUploadSuccess?: () => void;
}

export const Upload = ({ workspaceId, onUploadSuccess }: Props) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getSignal } = useAbortController();

  const addFiles = (incoming: File[]) => {
    const validTypes = ["application/pdf", "text/plain", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const newItems: FileItem[] = incoming
      .filter((f) => validTypes.includes(f.type) || f.name.match(/\.(pdf|txt|doc|docx)$/i))
      .map((f) => ({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}`, progress: 0, status: "idle" }));
    setFiles((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const uploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === "idle" || f.status === "error");
    if (!pending.length) return;
    setIsUploadingAll(true);

    for (const item of pending) {
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "uploading", progress: 0 } : f));
      try {
        await documentService.uploadDocument(workspaceId, item.file, getSignal(), (e) => {
          const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
          setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, progress: pct } : f));
        });
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "done", progress: 100 } : f));
      } catch (err: any) {
        if (err.name === "CanceledError") break;
        const msg = err.response?.data?.detail || "Upload failed";
        setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "error", error: msg } : f));
      }
    }

    setIsUploadingAll(false);
    if (onUploadSuccess) onUploadSuccess();
  }, [files, workspaceId, getSignal, onUploadSuccess]);

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const hasPending = files.some((f) => f.status === "idle" || f.status === "error");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 bg-gray-50 dark:bg-gray-800/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.doc,.docx"
          multiple
          onChange={handleFileInput}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-2xl transition-colors ${isDragging ? "bg-blue-100 text-blue-600" : "bg-white dark:bg-gray-800 text-gray-400 shadow-sm"}`}>
            <UploadIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">or <span className="text-blue-600 font-medium">browse</span> — PDF, DOCX, TXT supported</p>
          </div>
        </div>
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                item.status === "done"
                  ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                  : item.status === "error"
                  ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg flex-shrink-0 ${item.status === "done" ? "bg-green-100 text-green-600" : item.status === "error" ? "bg-red-100 text-red-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                <File className="w-5 h-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.file.name}</p>
                <p className="text-xs text-gray-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {item.error}
                  </p>
                )}
              </div>

              {/* Status / Remove */}
              <div className="flex-shrink-0">
                {item.status === "uploading" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                {item.status === "done" && <CheckCircle className="w-5 h-5 text-green-500" />}
                {(item.status === "idle" || item.status === "error") && (
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {files.length > 0 && (
        <div className="flex gap-3">
          {!allDone && (
            <button
              onClick={uploadAll}
              disabled={isUploadingAll || !hasPending}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {isUploadingAll ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
              ) : (
                <><UploadIcon className="w-4 h-4" /> Upload {files.filter((f) => f.status === "idle" || f.status === "error").length} File(s)</>
              )}
            </button>
          )}
          {allDone && (
            <div className="flex-1 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4" /> All files uploaded successfully!
            </div>
          )}
          <button
            onClick={() => setFiles([])}
            disabled={isUploadingAll}
            className="px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
