"use client"

import { Bell, User } from "lucide-react"

interface DashboardHeaderProps {
  guard?: any
}

export function DashboardHeader({ guard }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Badge: {guard?.badge_number}</h2>
          <p className="text-sm text-muted-foreground">{guard?.position}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <Bell size={20} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <User size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
