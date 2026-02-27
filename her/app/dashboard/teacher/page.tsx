"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { timetable, students, marks } from "@/lib/mock-data"
import { CalendarDays, UserCheck, BarChart3, Bus, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Timetable", href: "/dashboard/teacher", icon: CalendarDays },
  { label: "Attendance", href: "/dashboard/teacher", icon: UserCheck },
  { label: "Grades", href: "/dashboard/teacher", icon: BarChart3 },
  { label: "Bus Schedule", href: "/dashboard/teacher", icon: Bus },
]

const busSchedule = [
  { route: "Route A - City Center", departure: "7:30 AM", arrival: "8:15 AM" },
  { route: "Route B - Railway Station", departure: "7:15 AM", arrival: "8:20 AM" },
  { route: "Route C - Suburb East", departure: "7:00 AM", arrival: "8:10 AM" },
  { route: "Route D - Highway Junction", departure: "7:45 AM", arrival: "8:30 AM" },
]

export default function TeacherDashboardPage() {
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(students.map((s) => [s.id, true]))
  )
  const [activeTab, setActiveTab] = useState<"timetable" | "attendance" | "grades" | "bus">("timetable")

  const toggleAttendance = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <DashboardShell role="teacher" navItems={navItems}>
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["timetable", "attendance", "grades", "bus"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {tab === "bus" ? "Bus Schedule" : tab}
          </button>
        ))}
      </div>

      {/* Timetable */}
      {activeTab === "timetable" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-border bg-card"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Day</th>
                {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM"].map((time) => (
                  <th key={time} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((row) => (
                <tr key={row.day} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{row.day}</td>
                  {row.slots.map((slot, i) => (
                    <td key={i} className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                        slot === "Break"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      )}>
                        {slot !== "Break" && <Clock className="h-3 w-3" />}
                        {slot}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Attendance */}
      {activeTab === "attendance" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Mark Attendance - Data Structures</h2>
            <span className="text-xs text-muted-foreground">Feb 27, 2026</span>
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.id} - {student.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAttendance(student.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    attendance[student.id]
                    ? "bg-emerald-600/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-600/20 text-red-600 dark:text-red-400"
                  )}
                >
                  {attendance[student.id] ? "Present" : "Absent"}
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Submit Attendance
          </button>
        </motion.div>
      )}

      {/* Grades */}
      {activeTab === "grades" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto rounded-xl border border-border bg-card"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 1</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal 2</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => {
                const m = marks[i % marks.length]
                return (
                  <tr key={student.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm text-foreground">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{m.internal1}/50</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{m.internal2}/50</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{m.assignment}/20</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{m.total}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Bus Schedule */}
      {activeTab === "bus" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-base font-semibold text-foreground">Campus Bus Schedule</h2>
          {busSchedule.map((bus, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Bus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{bus.route}</p>
                  <p className="text-xs text-muted-foreground">Daily Service</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">{bus.departure} - {bus.arrival}</p>
                <p className="text-xs text-muted-foreground">On Time</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </DashboardShell>
  )
}
