"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, Trash2, Download } from "lucide-react"

interface DocumentUploadProps {
  visitId: string
  onUploadSuccess?: () => void
}

interface Document {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  uploaded_at: string
}

export function DocumentUpload({ visitId, onUploadSuccess }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("visitId", visitId)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setDocuments([...documents, data.document])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      onUploadSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (documentId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch("/api/documents/delete", {
        method: "DELETE",
        body: JSON.stringify({ documentId, fileUrl }),
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      setDocuments(documents.filter((doc) => doc.id !== documentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Documents & Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
            <p className="font-medium text-foreground">Click to upload a file</p>
            <p className="text-sm text-muted-foreground">or drag and drop</p>
          </label>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">{error}</div>}

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No documents uploaded yet</div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File size={20} className="text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Download size={16} />
                      Download
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id, doc.file_url)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
