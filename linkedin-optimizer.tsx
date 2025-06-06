"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Users, BarChart3, Zap, RefreshCw, Settings } from "lucide-react"
import { LinkedInAuth } from "./components/linkedin-auth"
import { fetchLinkedInProfile, fetchLinkedInPosts, analyzeProfile } from "./lib/linkedin-api"
import { EnhancedAutomation } from "./components/enhanced-automation"
import { RealTimeDashboard } from "./components/real-time-dashboard"

export default function LinkedInOptimizer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("linkedin_access_token")
    if (token) {
      setAccessToken(token)
      setIsAuthenticated(true)
      loadProfileData(token)
    }
  }, [])

  const handleAuthenticated = async (token: string) => {
    setAccessToken(token)
    setIsAuthenticated(true)
    localStorage.setItem("linkedin_access_token", token)
    await loadProfileData(token)
  }

  const loadProfileData = async (token: string) => {
    setIsLoading(true)
    try {
      const [profileData, postsData] = await Promise.all([fetchLinkedInProfile(token), fetchLinkedInPosts(token)])

      if (profileData) {
        setProfile(profileData)
        const profileAnalysis = await analyzeProfile(profileData)
        setAnalysis(profileAnalysis)
      }

      setPosts(postsData)
    } catch (error) {
      console.error("Error loading profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    if (accessToken) {
      loadProfileData(accessToken)
    }
  }

  const disconnect = () => {
    localStorage.removeItem("linkedin_access_token")
    setIsAuthenticated(false)
    setAccessToken(null)
    setProfile(null)
    setPosts([])
    setAnalysis(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">LinkedIn Profile Optimizer</h1>
            <p className="text-lg text-gray-600">Connect your LinkedIn account for automated optimization and growth</p>
          </div>
          <LinkedInAuth onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    )
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Loading your LinkedIn data...</h2>
            <p className="text-gray-600">This may take a few moments</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">LinkedIn Profile Optimizer</h1>
            <p className="text-lg text-gray-600">
              Welcome back, {profile.firstName}! Your profile is being optimized automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={disconnect}>
              <Settings className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">{profile.headline}</p>
                <p className="text-sm text-gray-500">{profile.location?.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{analysis?.completeness || 0}%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="optimizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Auto-Optimizer
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Network
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer">
            <EnhancedAutomation profile={profile} accessToken={accessToken!} />
          </TabsContent>

          <TabsContent value="analytics">
            <RealTimeDashboard profile={profile} />
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Content Suggestions</CardTitle>
                <CardDescription>Personalized content ideas based on your profile and industry trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>Industry Insight</Badge>
                      <Badge variant="secondary">High Engagement</Badge>
                    </div>
                    <h4 className="font-medium mb-2">Share your thoughts on recent {profile.industry} trends</h4>
                    <p className="text-sm text-gray-600 italic mb-3">
                      "I've been observing some interesting changes in {profile.industry}. Here's what I think it means
                      for professionals like us..."
                    </p>
                    <Button size="sm">Use This Template</Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>Career Story</Badge>
                      <Badge variant="secondary">Very High Engagement</Badge>
                    </div>
                    <h4 className="font-medium mb-2">Share a professional milestone or lesson learned</h4>
                    <p className="text-sm text-gray-600 italic mb-3">
                      "Looking back at my journey from {profile.positions[profile.positions.length - 1]?.title} to{" "}
                      {profile.positions[0]?.title}, here are the key lessons that shaped my career..."
                    </p>
                    <Button size="sm">Use This Template</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Connect with {profile.industry} leaders</h4>
                        <p className="text-sm text-gray-600">15 suggested connections</p>
                      </div>
                      <Button size="sm">View Suggestions</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Join industry groups</h4>
                        <p className="text-sm text-gray-600">8 relevant groups found</p>
                      </div>
                      <Button size="sm">View Groups</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Alumni connections</h4>
                        <p className="text-sm text-gray-600">23 alumni in your area</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Automated Networking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">Smart Networking Active</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Automatically sending 5-7 connection requests daily to relevant professionals
                      </p>
                      <div className="text-2xl font-bold text-blue-600">+23</div>
                      <div className="text-sm text-gray-600">New connections this week</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Recent Activity</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>• Connected with 3 {profile.industry} professionals</div>
                        <div>• Joined 1 new industry group</div>
                        <div>• Engaged with 12 posts in your network</div>
                        <div>• Received 5 profile views from connections</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
