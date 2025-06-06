"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface LinkedInAuthProps {
  onAuthenticated: (accessToken: string) => void
}

export function LinkedInAuth({ onAuthenticated }: LinkedInAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")

  const handleLinkedInConnect = () => {
    setIsConnecting(true)
    setConnectionStatus("connecting")

    const clientId = "77tx1bsnmw6fpj"
    const redirectUri = encodeURIComponent(window.location.origin + "/auth/linkedin/callback")
    const scope = encodeURIComponent("r_liteprofile r_emailaddress w_member_social r_organization_social")
    const state = Math.random().toString(36).substring(7)

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`

    // Store state for verification
    localStorage.setItem("linkedin_oauth_state", state)

    // Open LinkedIn OAuth in a popup
    const popup = window.open(authUrl, "linkedin-auth", "width=600,height=600,scrollbars=yes,resizable=yes")

    // Listen for the popup to close or receive message
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        setIsConnecting(false)

        // Check if we have the access token
        const accessToken = localStorage.getItem("linkedin_access_token")
        if (accessToken) {
          setConnectionStatus("connected")
          onAuthenticated(accessToken)
        } else {
          setConnectionStatus("error")
        }
      }
    }, 1000)

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
        clearInterval(checkClosed)
        popup?.close()
        setConnectionStatus("connected")
        onAuthenticated(event.data.accessToken)
        window.removeEventListener("message", messageListener)
      } else if (event.data.type === "LINKEDIN_AUTH_ERROR") {
        clearInterval(checkClosed)
        popup?.close()
        setConnectionStatus("error")
        window.removeEventListener("message", messageListener)
      }
    }

    window.addEventListener("message", messageListener)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">in</span>
          </div>
          Connect LinkedIn Account
        </CardTitle>
        <CardDescription>
          Connect your LinkedIn account to enable automatic profile optimization and analytics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus === "idle" && (
          <>
            <div className="space-y-2">
              <h4 className="font-medium">What you'll get:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automatic profile analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time optimization suggestions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Content performance analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated networking insights</span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLinkedInConnect}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect LinkedIn Account"
              )}
            </Button>
          </>
        )}

        {connectionStatus === "connecting" && (
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <div>
              <p className="font-medium">Connecting to LinkedIn...</p>
              <p className="text-sm text-gray-600">Please complete the authorization in the popup window</p>
            </div>
          </div>
        )}

        {connectionStatus === "connected" && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
            <div>
              <p className="font-medium text-green-600">Successfully Connected!</p>
              <p className="text-sm text-gray-600">Your LinkedIn account is now connected</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
            <div>
              <p className="font-medium text-red-600">Connection Failed</p>
              <p className="text-sm text-gray-600">Please try connecting again</p>
            </div>
            <Button onClick={handleLinkedInConnect} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>We only access data necessary for optimization.</p>
          <p>Your data is never shared with third parties.</p>
        </div>
      </CardContent>
    </Card>
  )
}
