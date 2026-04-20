import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const visitId = request.nextUrl.searchParams.get("visitId")

    if (!visitId) {
      return NextResponse.json({ error: "Visit ID required" }, { status: 400 })
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("visit_id", visitId)
      .order("uploaded_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
