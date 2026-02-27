"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, LogOut, Menu, X } from "lucide-react"
import { notifications } from "@/lib/mock-data"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardShellProps {
  role: string
  navItems: NavItem[]
  children: React.ReactNode
}

export function DashboardShell({ role, navItems, children }: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background bg-grid overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <span className="text-lg font-bold text-primary">O</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">OctoCampus</p>
            <p className="text-xs text-muted-foreground capitalize">{role} Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                  />
                )}
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground capitalize">{role} Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="pulse-red absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card p-2 shadow-2xl"
                >
                  <p className="px-3 py-2 text-sm font-semibold text-foreground">Notifications</p>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          !n.read ? "bg-primary/5" : ""
                        )}
                      >
                        <p className="font-medium text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground/60">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
