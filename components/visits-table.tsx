"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit2 } from "lucide-react"
import Link from "next/link"

interface Visit {
  id: string
  visitor_id: string
  status: string
  purpose: string
  check_in_time: string
  destination_floor?: string
  pass_card_number?: string
  visitors?: { first_name: string; last_name: string; company?: string }[]
}

interface VisitsTableProps {
  visits: Visit[]
}

export function VisitsTable({ visits }: VisitsTableProps) {
  const [filter, setFilter] = useState("all")

  const filteredVisits = filter === "all" ? visits : visits.filter((v) => v.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterLabels: { [key: string]: string } = {
    all: "Tümü",
    pending: "Beklemede",
    active: "Aktif",
    completed: "Tamamlandı",
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tüm Ziyaretler ({filteredVisits.length})</CardTitle>
        <div className="flex gap-2">
          {["all", "pending", "active", "completed"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-primary text-primary-foreground" : ""}
            >
              {filterLabels[status]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredVisits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Ziyaret bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Ziyaretçi</th>
                  <th className="text-left py-3 px-4 font-semibold">Şirket</th>
                  <th className="text-left py-3 px-4 font-semibold">Amaç</th>
                  <th className="text-left py-3 px-4 font-semibold">Kat</th>
                  <th className="text-left py-3 px-4 font-semibold">Geçiş Kartı</th>
                  <th className="text-left py-3 px-4 font-semibold">Durum</th>
                  <th className="text-left py-3 px-4 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-border hover:bg-secondary/50 transition">
                    <td className="py-3 px-4 font-medium">
                      {visit.visitors?.[0]?.first_name} {visit.visitors?.[0]?.last_name}
                    </td>
                    <td className="py-3 px-4">{visit.visitors?.[0]?.company || "-"}</td>
                    <td className="py-3 px-4">{visit.purpose}</td>
                    <td className="py-3 px-4">{visit.destination_floor || "-"}</td>
                    <td className="py-3 px-4 font-mono text-sm">{visit.pass_card_number || "-"}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/visits/${visit.id}`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Eye size={16} />
                            Görüntüle
                          </Button>
                        </Link>
                        <Link href={`/visits/${visit.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                            <Edit2 size={16} />
                            Düzenle
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
