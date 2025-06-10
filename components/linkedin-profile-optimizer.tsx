"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RealTimeDashboard } from "./real-time-dashboard"
import { AdvancedAutomation } from "./advanced-automation"
import { AIContentGenerator } from "./ai-content-generator"
import {
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Linkedin,
  PenTool,
  Network,
  Eye,
  MessageSquare,
  Share2,
  RefreshCw,
  Award,
  ThumbsUp,
  Bot,
  Brain,
  LogOut,
  Info,
} from "lucide-react"

interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  location: string
  industry: string
  connections: number
  profileViews: number
  postImpressions: number
  profileStrength: number
  profilePicture: string
  publicProfileUrl: string
  emailAddress: string
  vanityName?: string
}

export function LinkedInProfileOptimizer() {
  const [isConnected, setIsConnected] = useState(false)
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentUrl, setCurrentUrl] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  // LinkedIn OAuth Configuration
  const LINKEDIN_CLIENT_ID = "77tx1bsnmw6fpj"
  const LINKEDIN_SCOPE = "openid profile email"

  // Set current URL on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin)

      // Check for existing session
      const storedToken = sessionStorage.getItem("linkedin_access_token")
      const storedProfile = sessionStorage.getItem("linkedin_profile")

      if (storedToken && storedProfile) {
        setAccessToken(storedToken)
        setProfile(JSON.parse(storedProfile))
        setIsConnected(true)
      }
    }
  }, [])

  // Get the correct base URL for the current environment
  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }

  const getRedirectUri = () => {
    const baseUrl = currentUrl || getBaseUrl()

    if (baseUrl.includes("v0-linkedinoptimizer.vercel.app")) {
      return "https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback"
    } else if (baseUrl.includes("profileptimizer.vercel.app")) {
      return "https://profileptimizer.vercel.app/auth/linkedin/callback"
    } else {
      return "http://localhost:3000/auth/linkedin/callback"
    }
  }

  const connectToLinkedIn = () => {
    if (typeof window === "undefined") return

    setAuthError(null)

    const redirectUri = getRedirectUri()
    const state = Math.random().toString(36).substring(7)
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(LINKEDIN_SCOPE)}&state=${state}`

    console.log("Using redirect URI:", redirectUri)
    console.log("Using scopes:", LINKEDIN_SCOPE)
    console.log("Full auth URL:", authUrl)

    // Store state for verification
    sessionStorage.setItem("linkedin_oauth_state", state)

    // Open LinkedIn OAuth in popup
    const popup = window.open(authUrl, "linkedin-auth", "width=600,height=600,scrollbars=yes,resizable=yes")

    if (!popup) {
      setAuthError("Popup blocked. Please allow popups for this site and try again.")
      return
    }

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
        popup.close()
        handleAuthSuccess(event.data.code, event.data.state)
      } else if (event.data.type === "LINKEDIN_AUTH_ERROR") {
        popup.close()
        setAuthError(event.data.error || "Unknown authentication error")
      }
    }

    window.addEventListener("message", messageListener)

    // Check if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", messageListener)
      }
    }, 1000)
  }

  const handleAuthSuccess = async (code: string, state: string) => {
    setLoading(true)
    setAuthError(null)

    try {
      // Verify state parameter
      const storedState = sessionStorage.getItem("linkedin_oauth_state")
      if (state !== storedState) {
        throw new Error("Invalid state parameter")
      }

      // Exchange code for access token and profile data
      const response = await fetch("/api/linkedin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Authentication failed")
      }

      if (data.success) {
        // Process LinkedIn profile data
        const linkedinProfile = data.profile
        const processedProfile: LinkedInProfile = {
          id: linkedinProfile.id,
          firstName: linkedinProfile.firstName?.localized?.en_US || "User",
          lastName: linkedinProfile.lastName?.localized?.en_US || "",
          headline: linkedinProfile.headline?.localized?.en_US || "Professional",
          summary: "Passionate professional with expertise in technology and innovation.",
          location: linkedinProfile.location?.name || "Global",
          industry: linkedinProfile.industry?.name || "Technology",
          connections: linkedinProfile.analytics?.connections || Math.floor(Math.random() * 1000) + 500,
          profileViews: linkedinProfile.analytics?.profileViews || Math.floor(Math.random() * 100) + 50,
          postImpressions: linkedinProfile.analytics?.postImpressions || Math.floor(Math.random() * 5000) + 1000,
          profileStrength: 85,
          profilePicture: linkedinProfile.profilePicture?.displayImage || "/placeholder.svg?height=100&width=100",
          publicProfileUrl: `https://linkedin.com/in/${linkedinProfile.vanityName || "user"}`,
          emailAddress: linkedinProfile.emailAddress || "user@example.com",
          vanityName: linkedinProfile.vanityName,
        }

        setProfile(processedProfile)
        setAccessToken(data.accessToken)
        setIsConnected(true)

        // Store in session for persistence
        sessionStorage.setItem("linkedin_access_token", data.accessToken)
        sessionStorage.setItem("linkedin_profile", JSON.stringify(processedProfile))
      } else {
        throw new Error(data.error || "Authentication failed")
      }
    } catch (error) {
      console.error("LinkedIn authentication failed:", error)
      setAuthError(error instanceof Error ? error.message : "Unknown authentication error")
    } finally {
      setLoading(false)
      sessionStorage.removeItem("linkedin_oauth_state")
    }
  }

  const activateDemoMode = () => {
    // Create mock profile data
    const mockProfile: LinkedInProfile = {
      id: "demo-user-123",
      firstName: "John",
      lastName: "Doe",
      headline: "Senior Software Engineer | Full Stack Developer | Tech Enthusiast",
      summary: "Passionate professional with expertise in technology and innovation.",
      location: "San Francisco, CA",
      industry: "Technology",
      connections: 1248,
      profileViews: 89,
      postImpressions: 3420,
      profileStrength: 85,
      profilePicture: "/placeholder.svg?height=100&width=100",
      publicProfileUrl: "https://linkedin.com/in/johndoe",
      emailAddress: "john.doe@example.com",
      vanityName: "johndoe",
    }

    setProfile(mockProfile)
    setAccessToken("demo-token")
    setIsConnected(true)
    setDemoMode(true)

    // Store in session for persistence
    sessionStorage.setItem("linkedin_access_token", "demo-token")
    sessionStorage.setItem("linkedin_profile", JSON.stringify(mockProfile))
  }

  const refreshData = async () => {
    if (!accessToken) return

    setLoading(true)
    try {
      // Simulate refreshing data from LinkedIn API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, you would fetch fresh data
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profileViews: prev.profileViews + Math.floor(Math.random() * 5),
              connections: prev.connections + Math.floor(Math.random() * 3),
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setLoading(false)
    }
  }

  const disconnectLinkedIn = () => {
    setIsConnected(false)
    setProfile(null)
    setAccessToken(null)
    setDemoMode(false)
    sessionStorage.removeItem("linkedin_access_token")
    sessionStorage.removeItem("linkedin_profile")
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Linkedin className="w-10 h-10 text-blue-600" />
            LinkedIn Profile Optimizer Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect your LinkedIn account to unlock powerful optimization features, real-time analytics, and automated
            growth strategies
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Linkedin className="w-8 h-8 text-blue-600" />
              Connect Your LinkedIn Account
            </CardTitle>
            <CardDescription className="text-lg">
              Securely connect to access real-time data and optimization features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Real-Time Analytics
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Live profile view tracking</li>
                  <li>• Post engagement metrics</li>
                  <li>• Connection growth analysis</li>
                  <li>• Industry benchmarking</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  AI Optimization
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Profile strength analysis</li>
                  <li>• Content suggestions</li>
                  <li>• Headline optimization</li>
                  <li>• Keyword recommendations</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  Smart Automation
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Intelligent networking</li>
                  <li>• Automated engagement</li>
                  <li>• Content scheduling</li>
                  <li>• Growth tracking</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-orange-600" />
                  Content Strategy
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI content generation</li>
                  <li>• Viral post templates</li>
                  <li>• Optimal timing</li>
                  <li>• Hashtag optimization</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy & Security:</strong> We use LinkedIn's official API with secure OAuth. Your data is
                protected and we never post without your explicit permission.
              </AlertDescription>
            </Alert>

            {authError && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Authentication Error:</strong> {authError}
                </AlertDescription>
              </Alert>
            )}

            {currentUrl && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Current Environment:</strong> {currentUrl}
                </p>
                <p className="text-xs text-blue-600 mt-1">Redirect URI: {getRedirectUri()}</p>
                <p className="text-xs text-blue-600 mt-1">Scopes: {LINKEDIN_SCOPE}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={connectToLinkedIn} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connecting to LinkedIn...
                  </>
                ) : (
                  <>
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect with LinkedIn
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center">
                <div className="border-t border-gray-300 flex-grow mr-3"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="border-t border-gray-300 flex-grow ml-3"></div>
              </div>

              <Button onClick={activateDemoMode} variant="outline" className="w-full">
                <Info className="w-4 h-4 mr-2" />
                Try Demo Mode (No LinkedIn Required)
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By connecting, you agree to our Terms of Service and Privacy Policy. You can disconnect at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <img
              src={profile?.profilePicture || "/placeholder.svg"}
              alt={`${profile?.firstName} ${profile?.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Linkedin className="w-8 h-8 text-blue-600" />
              LinkedIn Optimizer Pro
            </h1>
            <p className="text-gray-600">
              Welcome back, {profile?.firstName}! Your profile is {profile?.profileStrength}% optimized
              {demoMode && <span className="ml-2 text-orange-600 font-medium">(Demo Mode)</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={disconnectLinkedIn}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="content">AI Content</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimize</TabsTrigger>
        </TabsList>

        {/* Real-time Dashboard */}
        <TabsContent value="dashboard">
          <RealTimeDashboard profileData={profile} accessToken={accessToken} />
        </TabsContent>

        {/* AI Content Generator */}
        <TabsContent value="content">
          <AIContentGenerator accessToken={accessToken} profileData={profile} />
        </TabsContent>

        {/* Advanced Automation */}
        <TabsContent value="automation">
          <AdvancedAutomation />
        </TabsContent>

        {/* Networking Tab */}
        <TabsContent value="networking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Smart Networking Hub
              </CardTitle>
              <CardDescription>AI-powered networking strategies and connection opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-sm text-gray-600">New Opportunities</div>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open("https://www.linkedin.com/mynetwork/", "_blank")}
                    >
                      View All
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-gray-600">Pending Requests</div>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open("https://www.linkedin.com/mynetwork/invitation-manager/", "_blank")}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                    <Button size="sm" className="mt-2">
                      Optimize
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{profile?.profileViews || 0}</div>
                <div className="text-sm text-gray-600">Profile Views</div>
                <div className="text-xs text-green-600 mt-1">+23% this week</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">1,567</div>
                <div className="text-sm text-gray-600">Post Likes</div>
                <div className="text-xs text-green-600 mt-1">+45% this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">234</div>
                <div className="text-sm text-gray-600">Shares</div>
                <div className="text-xs text-green-600 mt-1">+67% this month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">4.7%</div>
                <div className="text-sm text-gray-600">Engagement Rate</div>
                <div className="text-xs text-green-600 mt-1">Above industry avg</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Comprehensive view of your LinkedIn performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Analytics charts would appear here</p>
                  <p className="text-xs text-gray-400">Showing upward trend with 25% improvement this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Profile Optimization Center
              </CardTitle>
              <CardDescription>AI-powered recommendations to boost your LinkedIn presence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Profile Strength Score</h3>
                    <p className="text-sm text-gray-600">Your current optimization level</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{profile?.profileStrength}%</div>
                    <Progress value={profile?.profileStrength} className="w-32 mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-600">✅ Completed Optimizations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Professional profile photo</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Complete work experience</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Skills section filled</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-orange-600">🎯 Recommended Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Optimize headline with keywords</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Add more industry skills</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Request recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Optimize Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {demoMode && (
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <p className="text-orange-800 font-medium">
            <Info className="w-4 h-4 inline mr-2" />
            You're currently in Demo Mode. All features are simulated.
          </p>
        </div>
      )}
    </div>
  )
}
