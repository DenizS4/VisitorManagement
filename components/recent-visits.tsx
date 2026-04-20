"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentVisitsProps {
  guardId: string
}

interface Visit {
  id: string
  visitor_id: string
  status: string
  purpose: string
  check_in_time: string
  visitors?: { first_name: string; last_name: string; company?: string }[]
}

export function RecentVisits({ guardId }: RecentVisitsProps) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisits = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("visits")
        .select("*, visitors(*)")
        .eq("guard_id", guardId)
        .order("created_at", { ascending: false })
        .limit(5)

      setVisits(data || [])
      setIsLoading(false)
    }

    fetchVisits()
  }, [guardId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Son Ziyaretler</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground">Yükleniyor...</div>
        ) : visits.length === 0 ? (
          <div className="text-muted-foreground">Henüz ziyaret yok</div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {visit.visitors?.[0]?.first_name} {visit.visitors?.[0]?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{visit.purpose}</p>
                </div>
                <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
