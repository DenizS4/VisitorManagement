import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar"
import { EditVisitForm } from "@/components/edit-visit-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditVisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: visitId } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: guard } = await supabase.from("guards").select("*").eq("id", user.id).single()

  const { data: visit } = await supabase
    .from("visits")
    .select("*, visitors(*), pass_cards(*)")
    .eq("id", visitId)
    .single()

  if (!visit) {
    redirect("/visits")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader guard={guard} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 space-y-6">
            <Link href={`/visits/${visitId}`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft size={20} />
                Geri Dön
              </Button>
            </Link>

            <div>
              <h1 className="text-3xl font-bold text-foreground">Ziyaret Bilgilerini Düzenle</h1>
              <p className="text-muted-foreground">
                {visit.visitors?.[0]?.first_name} {visit.visitors?.[0]?.last_name} için ziyaret detaylarını güncelleyin
              </p>
            </div>

            <EditVisitForm visit={visit} />
          </div>
        </main>
      </div>
    </div>
  )
}
