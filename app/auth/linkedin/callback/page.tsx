"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function LinkedInCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const state = searchParams.get("state")
    const errorDescription = searchParams.get("error_description")

    if (error) {
      setStatus("error")
      setMessage(errorDescription || error || "Authentication failed")

      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "LINKEDIN_AUTH_ERROR",
            error: errorDescription || error,
          },
          window.location.origin,
        )
      }

      // Close popup after delay
      setTimeout(() => {
        window.close()
      }, 3000)
      return
    }

    if (code && state) {
      setStatus("success")
      setMessage("Authentication successful! Completing setup...")

      // Send success to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "LINKEDIN_AUTH_SUCCESS",
            code,
            state,
          },
          window.location.origin,
        )
      }

      // Close popup after delay
      setTimeout(() => {
        window.close()
      }, 2000)
    } else {
      setStatus("error")
      setMessage("Missing authorization code")

      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "LINKEDIN_AUTH_ERROR",
            error: "Missing authorization code",
          },
          window.location.origin,
        )
      }

      setTimeout(() => {
        window.close()
      }, 3000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-lg font-semibold mb-2">Processing Authentication</h2>
              <p className="text-gray-600">Please wait while we complete your LinkedIn connection...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-lg font-semibold mb-2 text-green-800">Success!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">This window will close automatically.</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h2 className="text-lg font-semibold mb-2 text-red-800">Authentication Failed</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">This window will close automatically.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
