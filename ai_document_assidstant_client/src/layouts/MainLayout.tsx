import * as React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { LogOut, Home, FolderOpen, Settings } from "lucide-react"
import { useAuthStore } from "../store/auth.store"
import { authService } from "../features/auth/services/auth.api"

export const MainLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      logout();
      navigate('/login');
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">AI Assistant</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <Link to="/" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/workspaces" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <FolderOpen className="w-5 h-5 mr-3" />
            Workspaces
          </Link>
          <Link to="/settings" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
          <div className="flex items-center space-x-4">
             {/* User Avatar Placeholder */}
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                U
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
