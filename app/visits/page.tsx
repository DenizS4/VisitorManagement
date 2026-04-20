import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { VisitsTable } from "@/components/visits-table"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function VisitsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: guard } = await supabase.from("guards").select("*").eq("id", user.id).single()

  const { data: visits } = await supabase
    .from("visits")
    .select("*, visitors(*)")
    .eq("guard_id", user.id)
    .order("visit_date", { ascending: false })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader guard={guard} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ziyaretleri Yönet</h1>
                <p className="text-muted-foreground">Ziyaretçi erişimini kaydedin ve yönetin</p>
              </div>
              <Link href="/visits/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <Plus size={20} />
                  Yeni Ziyaret
                </Button>
              </Link>
            </div>
            <VisitsTable visits={visits || []} />
          </div>
        </main>
      </div>
    </div>
  )
}
