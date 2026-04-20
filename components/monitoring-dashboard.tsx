"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

interface MonitoringDashboardProps {
  guardId: string
}

interface ActiveVisit {
  id: string
  visitor_id: string
  status: string
  check_in_time: string
  destination_floor?: string
  purpose: string
  visitors?: { first_name: string; last_name: string; company?: string }[]
}

export function MonitoringDashboard({ guardId }: MonitoringDashboardProps) {
  const [activeVisits, setActiveVisits] = useState<ActiveVisit[]>([])
  const [stats, setStats] = useState({ totalActive: 0, totalCompleted: 0, totalCancelled: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMonitoringData = async () => {
      const supabase = createClient()

      const { data: active } = await supabase
        .from("visits")
        .select("*, visitors(*)")
        .eq("status", "active")
        .order("check_in_time", { ascending: false })

      setActiveVisits(active || [])

      const { count: completedCount } = await supabase
        .from("visits")
        .select("id", { count: "exact" })
        .eq("status", "completed")

      const { count: cancelledCount } = await supabase
        .from("visits")
        .select("id", { count: "exact" })
        .eq("status", "cancelled")

      setStats({
        totalActive: active?.length || 0,
        totalCompleted: completedCount || 0,
        totalCancelled: cancelledCount || 0,
      })

      setIsLoading(false)
    }

    fetchMonitoringData()
  }, [])

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("tr-TR")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Ziyaretçiler</CardTitle>
            <Clock className="text-blue-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalActive}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugün Tamamlanan</CardTitle>
            <CheckCircle2 className="text-green-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalCompleted}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İptal Edildi</CardTitle>
            <AlertCircle className="text-red-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalCancelled}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Şu Anda Ziyaret Edenler</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">Yükleniyor...</div>
          ) : activeVisits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Şu an aktif ziyaretçi yok</div>
          ) : (
            <div className="space-y-3">
              {activeVisits.map((visit) => (
                <div key={visit.id} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">
                        {visit.visitors?.[0]?.first_name} {visit.visitors?.[0]?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{visit.visitors?.[0]?.company || "Belirtilmedi"}</p>
                      <p className="text-sm mt-2 text-foreground">
                        <span className="font-semibold">Amaç:</span> {visit.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Kat:</span> {visit.destination_floor || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold">Giriş:</span> {formatTime(visit.check_in_time)}
                      </p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">{visit.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
