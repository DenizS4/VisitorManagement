import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const visitId = formData.get("visitId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!visitId) {
      return NextResponse.json({ error: "No visit ID provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Store document info in Supabase
    const { data, error } = await supabase
      .from("documents")
      .insert({
        visit_id: visitId,
        file_name: file.name,
        file_url: blob.url,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      document: data,
      url: blob.url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
