import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { Sidebar } from "@/components/sidebar"

export default async function MonitoringPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: guard } = await supabase.from("guards").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader guard={guard} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Erişim İzleme</h1>
              <p className="text-muted-foreground">Gerçek zamanlı ziyaretçi erişimi ve güvenlik içgörüleri</p>
            </div>
            <MonitoringDashboard guardId={user.id} />
          </div>
        </main>
      </div>
    </div>
  )
}
