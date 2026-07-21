import * as React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "../layouts/AuthLayout"
import { MainLayout } from "../layouts/MainLayout"
import { PrivateRoute } from "./PrivateRoute"

// Auth
import { Login } from "../features/auth/pages/Login"
import { Register } from "../features/auth/pages/Register"

// Dashboard
import { Dashboard } from "../features/dashboard/pages/Dashboard"

// Workspaces
import { WorkspacesList } from "../features/workspace/pages/WorkspacesList"
import Workspace from "../features/workspace/pages/Workspace"

// Documents
import { DocumentLibrary } from "../features/documents/pages/DocumentLibrary"
import { SourceViewer } from "../features/documents/pages/SourceViewer"
import { UploadDocuments } from "../features/documents/pages/UploadDocuments"
import { ProcessingStatus } from "../features/documents/pages/ProcessingStatus"

// Chat
import { DocumentChat } from "../features/chat/pages/DocumentChat"

// Settings
import { Settings } from "../features/settings/pages/Settings"

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public / Auth Routes ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── Protected Routes ── */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Workspaces */}
          <Route path="/workspaces" element={<WorkspacesList />} />
          <Route path="/workspace/:id" element={<Workspace />} />

          {/* Documents */}
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/documents/upload" element={<UploadDocuments />} />
          <Route path="/documents/:id/view" element={<SourceViewer />} />
          <Route path="/documents/:id/processing" element={<ProcessingStatus />} />

          {/* Chat */}
          <Route path="/chat" element={<DocumentChat />} />
          <Route path="/chat/:id" element={<DocumentChat />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
