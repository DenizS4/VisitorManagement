"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    badgeNumber: "",
    position: "Güvenlik Görevlisi",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.repeatPassword) {
      setError("Parolalar eşleşmiyor")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            badge_number: formData.badgeNumber,
            position: formData.position,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-primary">Güvenlik Görevlisi Portalı</span>
            </div>
            <div>
              <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
              <CardDescription>Yeni bir güvenlik görevlisi olarak kaydolun</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-sm">
                    Adı
                  </Label>
                  <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-sm">
                    Soyadı
                  </Label>
                  <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="badgeNumber" className="text-sm">
                  Badge Numarası
                </Label>
                <Input
                  id="badgeNumber"
                  name="badgeNumber"
                  required
                  value={formData.badgeNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position" className="text-sm">
                  Pozisyon
                </Label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Güvenlik Görevlisi</option>
                  <option>Süpervizör</option>
                  <option>Müdür</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm">
                  E-posta
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="guard@security.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm">
                  Parola
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="repeatPassword" className="text-sm">
                  Parolayı Onayla
                </Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  name="repeatPassword"
                  required
                  value={formData.repeatPassword}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground mb-2">Zaten bir hesabınız var mı?</p>
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Giriş Yap
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
