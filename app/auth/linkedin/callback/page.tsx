"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { authenticateLinkedIn } from "../../../../lib/linkedin-api"

export default function LinkedInCallback() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const storedState = localStorage.getItem("linkedin_oauth_state")

      if (code && state === storedState) {
        const result = await authenticateLinkedIn(code)
        if (result.success) {
          localStorage.setItem("linkedin_access_token", result.accessToken)
          localStorage.removeItem("linkedin_oauth_state")
          window.close() // Close the popup
        }
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Completing LinkedIn authentication...</p>
      </div>
    </div>
  )
}
