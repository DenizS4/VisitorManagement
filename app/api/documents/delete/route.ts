import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, fileUrl } = await request.json()

    if (!documentId || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Delete from Supabase
    const { error: dbError } = await supabase.from("documents").delete().eq("id", documentId).eq("uploaded_by", user.id)

    if (dbError) throw dbError

    // Delete from Vercel Blob
    await del(fileUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
