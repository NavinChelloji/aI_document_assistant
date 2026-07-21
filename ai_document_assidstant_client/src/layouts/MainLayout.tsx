import * as React from "react"
import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Bell } from "lucide-react"
import { Sidebar } from "./Sidebar"
import { useAuthStore } from "../store/auth.store"

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Derive page title from path
  const pageTitle = (() => {
    const p = location.pathname
    if (p.startsWith("/dashboard")) return "Dashboard"
    if (p.startsWith("/workspaces")) return "Workspaces"
    if (p.startsWith("/workspace/")) return "Workspace"
    if (p.startsWith("/documents")) return "Documents"
    if (p.startsWith("/chat")) return "AI Chat"
    if (p.startsWith("/settings")) return "Settings"
    return "AI Document Assistant"
  })()

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U"

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────
          Desktop: always visible (w-64, static)
          Mobile:  slide-in drawer from left (fixed, z-40)
      ──────────────────────────────────────────────────────── */}
      <div className={`
        fixed inset-y-0 left-0 z-40 h-full
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Header ── */}
        <header className="flex-shrink-0 h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 gap-4">
          {/* Hamburger — mobile only */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            {user?.full_name && (
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                {user.full_name}
              </span>
            )}
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
