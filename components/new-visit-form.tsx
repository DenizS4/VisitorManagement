"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewVisitFormProps {
  guardId: string
}

export function NewVisitForm({ guardId }: NewVisitFormProps) {
  const [formData, setFormData] = useState({
    visitorFirstName: "",
    visitorLastName: "",
    visitorEmail: "",
    visitorPhone: "",
    visitorCompany: "",
    purpose: "",
    destinationFloor: "",
    visitDate: new Date().toISOString().split("T")[0],
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generatePassCardNumber = () => {
    return "PASS-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data: visitorData, error: visitorError } = await supabase
        .from("visitors")
        .insert({
          first_name: formData.visitorFirstName,
          last_name: formData.visitorLastName,
          email: formData.visitorEmail,
          phone: formData.visitorPhone,
          company: formData.visitorCompany,
        })
        .select()
        .single()

      if (visitorError) throw visitorError

      const passCardNumber = generatePassCardNumber()
      const { data: visitData, error: visitError } = await supabase
        .from("visits")
        .insert({
          visitor_id: visitorData.id,
          guard_id: guardId,
          visit_date: formData.visitDate,
          purpose: formData.purpose,
          destination_floor: formData.destinationFloor,
          pass_card_number: passCardNumber,
          status: "pending",
          check_in_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (visitError) throw visitError

      await supabase.from("pass_cards").insert({
        visit_id: visitData.id,
        card_number: passCardNumber,
        access_level: "visitor",
        issued_by: guardId,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })

      router.push(`/visits/${visitData.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border max-w-2xl">
      <CardHeader>
        <CardTitle>Ziyaretçi Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitorFirstName">Adı *</Label>
              <Input
                id="visitorFirstName"
                name="visitorFirstName"
                required
                value={formData.visitorFirstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="visitorLastName">Soyadı *</Label>
              <Input
                id="visitorLastName"
                name="visitorLastName"
                required
                value={formData.visitorLastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitorEmail">E-posta</Label>
              <Input
                id="visitorEmail"
                name="visitorEmail"
                type="email"
                value={formData.visitorEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="visitorPhone">Telefon</Label>
              <Input
                id="visitorPhone"
                name="visitorPhone"
                type="tel"
                value={formData.visitorPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="visitorCompany">Şirket</Label>
            <Input id="visitorCompany" name="visitorCompany" value={formData.visitorCompany} onChange={handleChange} />
          </div>

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

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Ziyaret Oluşturuluyor..." : "Ziyaret Oluştur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
