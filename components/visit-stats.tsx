"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface VisitStatsProps {
  guardId: string
}

export function VisitStats({ guardId }: VisitStatsProps) {
  const [stats, setStats] = useState({
    todayVisits: 0,
    activeVisits: 0,
    completedVisits: 0,
    pendingVisits: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      const { data: todayVisits } = await supabase
        .from("visits")
        .select("id")
        .eq("guard_id", guardId)
        .gte("visit_date", today)

      const { data: activeVisits } = await supabase
        .from("visits")
        .select("id")
        .eq("guard_id", guardId)
        .eq("status", "active")

      const { data: completedVisits } = await supabase
        .from("visits")
        .select("id")
        .eq("guard_id", guardId)
        .eq("status", "completed")

      const { data: pendingVisits } = await supabase
        .from("visits")
        .select("id")
        .eq("guard_id", guardId)
        .eq("status", "pending")

      setStats({
        todayVisits: todayVisits?.length || 0,
        activeVisits: activeVisits?.length || 0,
        completedVisits: completedVisits?.length || 0,
        pendingVisits: pendingVisits?.length || 0,
      })
    }

    fetchStats()
  }, [guardId])

  const statCards = [
    {
      title: "Bugünün Ziyaretleri",
      value: stats.todayVisits,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Aktif Ziyaretler",
      value: stats.activeVisits,
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Tamamlanan",
      value: stats.completedVisits,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Beklemede",
      value: stats.pendingVisits,
      icon: AlertCircle,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`${stat.color} opacity-70`} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
