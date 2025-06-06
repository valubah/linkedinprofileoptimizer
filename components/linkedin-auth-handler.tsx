"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Linkedin, Loader2 } from "lucide-react"

interface AuthState {
  status: "idle" | "connecting" | "success" | "error"
  message: string
  profile?: any
}

export function LinkedInAuthHandler() {
  const [authState, setAuthState] = useState<AuthState>({
    status: "idle",
    message: "",
  })

  const initiateLinkedInAuth = () => {
    setAuthState({ status: "connecting", message: "Redirecting to LinkedIn..." })

    const clientId = "77tx1bsnmw6fpj"
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/linkedin/callback`)
    const scope = encodeURIComponent("r_liteprofile r_emailaddress w_member_social")
    const state = Math.random().toString(36).substring(7) // CSRF protection

    // Store state in sessionStorage for verification
    sessionStorage.setItem("linkedin_oauth_state", state)

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`

    // Open LinkedIn OAuth in a popup window
    const popup = window.open(
      authUrl,
      "linkedin-auth",
      "width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no",
    )

    if (!popup) {
      setAuthState({
        status: "error",
        message: "Popup blocked. Please allow popups for this site and try again.",
      })
      return
    }

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
        popup.close()
        handleAuthSuccess(event.data.code, event.data.state)
      } else if (event.data.type === "LINKEDIN_AUTH_ERROR") {
        popup.close()
        setAuthState({
          status: "error",
          message: event.data.error || "Authentication failed",
        })
      }
    }

    window.addEventListener("message", messageListener)

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", messageListener)
        if (authState.status === "connecting") {
          setAuthState({
            status: "error",
            message: "Authentication was cancelled",
          })
        }
      }
    }, 1000)
  }

  const handleAuthSuccess = async (code: string, state: string) => {
    try {
      // Verify state parameter
      const storedState = sessionStorage.getItem("linkedin_oauth_state")
      if (state !== storedState) {
        throw new Error("Invalid state parameter")
      }

      setAuthState({ status: "connecting", message: "Exchanging authorization code..." })

      // Exchange code for access token
      const response = await fetch("/api/linkedin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error("Failed to authenticate with LinkedIn")
      }

      const data = await response.json()

      if (data.success) {
        setAuthState({
          status: "success",
          message: "Successfully connected to LinkedIn!",
          profile: data.profile,
        })

        // Store access token securely (in a real app, this should be handled server-side)
        sessionStorage.setItem("linkedin_access_token", data.accessToken)

        // Redirect to dashboard or trigger parent component update
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(data.error || "Authentication failed")
      }
    } catch (error) {
      console.error("LinkedIn auth error:", error)
      setAuthState({
        status: "error",
        message: error instanceof Error ? error.message : "Authentication failed",
      })
    } finally {
      // Clean up
      sessionStorage.removeItem("linkedin_oauth_state")
    }
  }

  const resetAuth = () => {
    setAuthState({ status: "idle", message: "" })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Linkedin className="w-6 h-6 text-blue-600" />
          LinkedIn Authentication
        </CardTitle>
        <CardDescription>Connect your LinkedIn account to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authState.status === "idle" && (
          <>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-medium text-sm mb-1">What you'll get:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Real-time profile analytics</li>
                  <li>• AI-powered content suggestions</li>
                  <li>• Smart networking recommendations</li>
                  <li>• Automated engagement tools</li>
                </ul>
              </div>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Secure:</strong> We use LinkedIn's official OAuth 2.0 with read-only access. Your credentials
                  are never stored.
                </AlertDescription>
              </Alert>
            </div>
            <Button onClick={initiateLinkedInAuth} className="w-full" size="lg">
              <Linkedin className="w-4 h-4 mr-2" />
              Connect with LinkedIn
            </Button>
          </>
        )}

        {authState.status === "connecting" && (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-sm text-gray-600">{authState.message}</p>
          </div>
        )}

        {authState.status === "success" && (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2">Connection Successful!</h3>
            <p className="text-sm text-gray-600 mb-4">{authState.message}</p>
            {authState.profile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-left">
                <p className="text-sm">
                  <strong>Welcome, {authState.profile.firstName?.localized?.en_US || "User"}!</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">Redirecting to your dashboard...</p>
              </div>
            )}
          </div>
        )}

        {authState.status === "error" && (
          <div className="text-center py-6">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-red-800 mb-2">Connection Failed</h3>
            <p className="text-sm text-gray-600 mb-4">{authState.message}</p>
            <Button onClick={resetAuth} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
