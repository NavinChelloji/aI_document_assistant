import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "../layouts/AuthLayout"
import { MainLayout } from "../layouts/MainLayout"
import { PrivateRoute } from "./PrivateRoute"
import { Login } from "../features/auth/pages/Login"
import { Register } from "../features/auth/pages/Register"

import { Dashboard } from "../features/dashboard/pages/Dashboard"
import { WorkspaceView } from "../features/workspace/pages/WorkspaceView"
import { UploadDocuments } from "../features/documents/pages/UploadDocuments"
import { ProcessingStatus } from "../features/documents/pages/ProcessingStatus"
import { DocumentChat } from "../features/chat/pages/DocumentChat"
import { SourceViewer } from "../features/documents/pages/SourceViewer"
import { DocumentLibrary } from "../features/documents/pages/DocumentLibrary"
import { Settings } from "../features/settings/pages/Settings"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspaces" element={<Navigate to="/dashboard" replace />} />
          <Route path="/workspace/:id" element={<WorkspaceView />} />
          
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/documents/upload" element={<UploadDocuments />} />
          <Route path="/documents/:id/processing" element={<ProcessingStatus />} />
          <Route path="/documents/:id/view" element={<SourceViewer />} />
          <Route path="/workspace/:id/documents" element={<DocumentLibrary />} />
          
          <Route path="/chat" element={<DocumentChat />} />
          <Route path="/chat/:id" element={<DocumentChat />} />
          
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
