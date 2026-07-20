import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './features/dashboard/pages/Dashboard';
import Login from './features/auth/pages/Login';
import DocumentLibrary from './features/documents/pages/DocumentLibrary';
import Upload from './features/documents/pages/Upload';
import Chat from './features/chat/pages/Chat';
import Settings from './features/settings/pages/Settings';
import Workspace from './features/workspace/pages/Workspace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/documents" element={<DocumentLibrary />} />
          <Route path="/documents/upload" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
