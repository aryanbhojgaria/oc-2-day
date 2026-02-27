"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { adminStats, announcements, requests } from "@/lib/mock-data"
import { Megaphone, FileCheck, CalendarDays, Settings, Users, GraduationCap, Building2, Palette, Check, X, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", href: "/dashboard/admin", icon: Building2 },
  { label: "Announcements", href: "/dashboard/admin", icon: Megaphone },
  { label: "Requests", href: "/dashboard/admin", icon: FileCheck },
  { label: "Calendar", href: "/dashboard/admin", icon: CalendarDays },
  { label: "Settings", href: "/dashboard/admin", icon: Settings },
]

const statCards = [
  { label: "Total Students", value: adminStats.totalStudents.toLocaleString(), icon: GraduationCap, change: "+120 this semester" },
  { label: "Total Teachers", value: adminStats.totalTeachers.toString(), icon: Users, change: "+8 new hires" },
  { label: "Departments", value: adminStats.totalDepartments.toString(), icon: Building2, change: "All active" },
  { label: "Active Clubs", value: adminStats.activeClubs.toString(), icon: Palette, change: "2 events this week" },
]

export default function AdminDashboardPage() {
  const [reqList, setReqList] = useState(requests)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")

  const handleApprove = (id: string) => {
    setReqList((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
  }

  const handleReject = (id: string) => {
    setReqList((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)))
  }

  return (
    <DashboardShell role="admin" navItems={navItems}>
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Announcements */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold text-foreground">Recent Announcements</h2>
          <div className="mt-4 space-y-3">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div className={cn(
                  "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  ann.priority === "high" ? "bg-primary pulse-red" : ann.priority === "medium" ? "bg-primary/60" : "bg-muted-foreground/40"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{ann.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ann.content}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60">{ann.author}</span>
                    <span className="text-xs text-muted-foreground/40">{ann.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Announcement Form */}
          <div className="mt-5 border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground">Post New Announcement</h3>
            <input
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Title"
              className="mt-3 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <textarea
              value={announcementContent}
              onChange={(e) => setAnnouncementContent(e.target.value)}
              placeholder="Announcement content..."
              rows={3}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <button
              onClick={() => {
                setAnnouncementTitle("")
                setAnnouncementContent("")
              }}
              className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Requests */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Pending Requests</h2>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-xs font-bold text-primary">
              {reqList.filter((r) => r.status === "pending").length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {reqList.map((req) => (
              <div key={req.id} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary">{req.type}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        req.status === "pending" ? "bg-primary/15 text-primary" :
                        req.status === "approved" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                        "bg-red-500/15 text-red-600 dark:text-red-400"
                      )}>
                        {req.status === "pending" ? <Clock className="h-3 w-3" /> :
                         req.status === "approved" ? <Check className="h-3 w-3" /> :
                         <X className="h-3 w-3" />}
                        {req.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{req.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{req.from} - {req.date}</p>
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-600/30 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
