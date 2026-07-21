import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Folders, FileText, MessageSquare,
  Settings, Bot, LogOut, X
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../features/auth/services/auth.api';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Folders,         label: 'Workspaces', path: '/workspaces' },
  { icon: FileText,        label: 'Documents',  path: '/documents' },
  { icon: MessageSquare,   label: 'Chats',      path: '/chat' },
];

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-[var(--bg-surface)] border-r border-[var(--border-default)] transition-colors shadow-xl md:shadow-none">

      {/* Logo + Mobile Close */}
      <div className="flex h-14 md:h-16 items-center justify-between px-5 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-[var(--text-default)] tracking-tight leading-tight">
            AI Doc<br /><span className="text-blue-600">Assistant</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 -mr-1 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-default)]'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom: Settings + Logout */}
      <div className="p-3 border-t border-[var(--border-default)] space-y-0.5">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors',
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-default)]'
            )
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-[var(--text-muted)] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
