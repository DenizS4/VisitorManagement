"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditVisitFormProps {
  visit: any
}

export function EditVisitForm({ visit }: EditVisitFormProps) {
  const [formData, setFormData] = useState({
    purpose: visit.purpose || "",
    destinationFloor: visit.destination_floor || "",
    visitDate: visit.visit_date?.split("T")[0] || "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("visits")
        .update({
          purpose: formData.purpose,
          destination_floor: formData.destinationFloor,
          visit_date: formData.visitDate,
        })
        .eq("id", visit.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push(`/visits/${visit.id}`)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border max-w-2xl">
      <CardHeader>
        <CardTitle>Ziyaret Bilgilerini Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="purpose">Ziyaret Amacı *</Label>
            <textarea
              id="purpose"
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleChange}
              className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destinationFloor">Hedef Kat</Label>
              <Input
                id="destinationFloor"
                name="destinationFloor"
                value={formData.destinationFloor}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="visitDate">Ziyaret Tarihi *</Label>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                required
                value={formData.visitDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{error}</div>}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
              Ziyaret başarıyla güncellendi!
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || success}
          >
            {isLoading ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
