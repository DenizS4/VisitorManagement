"use client"

import { Activity, LogOut, Menu, Users, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setTimeout(() => {
      router.replace("/auth/login")
    }, 500)
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg hover:bg-secondary"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground transform md:transform-none transition-transform z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mt-8 md:mt-0">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-lg">GüvenliPass</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
              onClick={() => setIsOpen(false)}
            >
              <Activity size={20} />
              Pano
            </Link>
            <Link
              href="/visits"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} />
              Ziyaretleri Yönet
            </Link>
            <Link
              href="/monitoring"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition"
              onClick={() => setIsOpen(false)}
            >
              <Activity size={20} />
              İzleme
            </Link>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition text-left"
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
