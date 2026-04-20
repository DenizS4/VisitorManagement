"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface VisitDetailCardProps {
  visit: any
}

export function VisitDetailCard({ visit }: VisitDetailCardProps) {
  const [status, setStatus] = useState(visit.status)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("visits")
        .update({
          status: newStatus,
          check_out_time: newStatus === "completed" ? new Date().toISOString() : visit.check_out_time,
        })
        .eq("id", visit.id)

      if (error) throw error
      setStatus(newStatus)
      router.refresh()
    } catch (error) {
      console.error("Durum güncellenirken hata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const statusLabels: { [key: string]: string } = {
    pending: "Beklemede",
    active: "Aktif",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Ziyaret Detayları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Durum</p>
            <Badge className={getStatusColor(status)}>{statusLabels[status] || status}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Geçiş Kartı</p>
            <p className="font-mono font-bold text-primary">{visit.pass_card_number}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Ziyaret Tarihi</p>
            <p className="font-medium">{new Date(visit.visit_date).toLocaleDateString("tr-TR")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-semibold">Giriş Saati</p>
            <p className="font-medium">{new Date(visit.check_in_time).toLocaleTimeString("tr-TR")}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground font-semibold mb-2">Hedef Kat</p>
          <p className="font-medium">{visit.destination_floor || "Belirtilmedi"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground font-semibold mb-2">Amaç</p>
          <p className="text-foreground">{visit.purpose}</p>
        </div>

        {visit.notes && (
          <div>
            <p className="text-sm text-muted-foreground font-semibold mb-2">Notlar</p>
            <p className="text-foreground">{visit.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground font-semibold">İşlemler</p>
          <div className="flex gap-2 flex-wrap">
            {status === "pending" && (
              <Button
                onClick={() => updateStatus("active")}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Giriş Yap
              </Button>
            )}
            {status === "active" && (
              <Button
                onClick={() => updateStatus("completed")}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Çıkış Yap
              </Button>
            )}
            {status !== "cancelled" && (
              <Button
                onClick={() => updateStatus("cancelled")}
                disabled={isLoading}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Ziyareti İptal Et
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
