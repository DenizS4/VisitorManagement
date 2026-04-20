"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        router.push("/dashboard")
      }
    }

    checkSession()

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        router.push("/dashboard")
      }
    })

    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu")
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
              <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
              <CardDescription>Güvenlik görevlisi hesabınıza giriş yapın</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">
                  E-posta
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="guard@security.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-input"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground">
                  Parola
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-input"
                  disabled={isLoading}
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
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">Hesabınız yok mu?</p>
              <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                Görevli Hesabı Oluştur
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
