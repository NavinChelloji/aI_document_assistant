import React from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Input } from '../ui/input/Input';
import { useTheme } from '../context/ThemeContext';

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-6 transition-colors">
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-md">
          <Input 
            icon={<Search className="h-4 w-4" />} 
            placeholder="Search anything..." 
            className="bg-[var(--bg-subtle)] border-transparent rounded-full h-10 text-[var(--text-default)]"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-default)] rounded-full hover:bg-[var(--bg-subtle)] transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-default)] rounded-full hover:bg-[var(--bg-subtle)] transition-colors">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[var(--color-error-500)] ring-2 ring-[var(--bg-surface)]" />
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-[var(--border-default)] pl-4 cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-[var(--color-primary-500)]/10 flex items-center justify-center text-[var(--color-primary-500)] font-bold">
            JD
          </div>
          <span className="text-sm font-medium text-[var(--text-default)]">John Doe</span>
        </div>
      </div>
    </header>
  );
};
