"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "lucide-react"

interface LinkedInProfile {
  name: string
  headline: string
  connections: number
  profileViews: number
  postImpressions: number
  profileStrength: number
}

interface ContentSuggestion {
  type: string
  title: string
  content: string
  expectedEngagement: string
  bestTime: string
}

interface OptimizationTask {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  completed: boolean
  category: string
}

export function LinkedInOptimizer() {
  const [isConnected, setIsConnected] = useState(false)
  const [profile, setProfile] = useState<LinkedInProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for demonstration
  const mockProfile: LinkedInProfile = {
    name: "Professional User",
    headline: "Software Developer | Tech Enthusiast",
    connections: 847,
    profileViews: 156,
    postImpressions: 2340,
    profileStrength: 75,
  }

  const contentSuggestions: ContentSuggestion[] = [
    {
      type: "Industry Insight",
      title: "5 Tech Trends Shaping 2024",
      content: "Share your perspective on emerging technologies and their impact on your industry...",
      expectedEngagement: "High (200+ reactions)",
      bestTime: "Tuesday 9:00 AM",
    },
    {
      type: "Personal Achievement",
      title: "Lessons from My Latest Project",
      content: "Reflect on a recent accomplishment and the key learnings you gained...",
      expectedEngagement: "Medium (100+ reactions)",
      bestTime: "Wednesday 2:00 PM",
    },
    {
      type: "Industry Question",
      title: "What's Your Take on Remote Work?",
      content: "Ask your network about their experiences with remote work trends...",
      expectedEngagement: "High (300+ comments)",
      bestTime: "Thursday 11:00 AM",
    },
  ]

  const optimizationTasks: OptimizationTask[] = [
    {
      id: "1",
      title: "Add Professional Photo",
      description: "Upload a high-quality headshot to increase profile views by 21x",
      impact: "high",
      completed: true,
      category: "Profile",
    },
    {
      id: "2",
      title: "Optimize Headline with Keywords",
      description: "Include industry keywords to improve search visibility",
      impact: "high",
      completed: false,
      category: "Profile",
    },
    {
      id: "3",
      title: "Write Compelling Summary",
      description: "Craft a summary that tells your professional story",
      impact: "high",
      completed: false,
      category: "Profile",
    },
    {
      id: "4",
      title: "Add 5 Relevant Skills",
      description: "Include skills that recruiters search for in your field",
      impact: "medium",
      completed: true,
      category: "Skills",
    },
    {
      id: "5",
      title: "Post Weekly Content",
      description: "Share valuable insights to build thought leadership",
      impact: "high",
      completed: false,
      category: "Content",
    },
  ]

  const connectToLinkedIn = async () => {
    setLoading(true)

    // Simulate LinkedIn OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsConnected(true)
    setProfile(mockProfile)
    setLoading(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedTasks = optimizationTasks.filter((task) => task.completed).length
  const totalTasks = optimizationTasks.length
  const completionPercentage = (completedTasks / totalTasks) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Linkedin className="w-10 h-10 text-blue-600" />
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Optimize your LinkedIn profile with data-driven insights and proven strategies for professional growth
        </p>
      </div>

      {/* Connection Status */}
      {!isConnected ? (
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Linkedin className="w-6 h-6 text-blue-600" />
              Connect Your LinkedIn
            </CardTitle>
            <CardDescription>
              Connect your LinkedIn account to get personalized optimization recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This tool provides optimization suggestions and content ideas. Automated
                actions on LinkedIn may violate their Terms of Service. Always engage authentically.
              </AlertDescription>
            </Alert>
            <Button onClick={connectToLinkedIn} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect to LinkedIn
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="content">Content Hub</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="networking">Networking</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Connections</p>
                      <p className="text-2xl font-bold">{profile?.connections.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+23 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-2xl font-bold">{profile?.profileViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+12% vs last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Post Impressions</p>
                      <p className="text-2xl font-bold">{profile?.postImpressions.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+34% vs last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Strength</p>
                      <p className="text-2xl font-bold">{profile?.profileStrength}%</p>
                    </div>
                    <Target className="w-8 h-8 text-orange-600" />
                  </div>
                  <Progress value={profile?.profileStrength} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Wins</CardTitle>
                <CardDescription>Complete these tasks to boost your profile performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <Badge className={getImpactColor(task.impact)}>{task.impact} impact</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Profile Optimization Tasks
                </CardTitle>
                <CardDescription>
                  Complete these tasks to improve your profile visibility and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedTasks}/{totalTasks} completed
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                <div className="space-y-4">
                  {optimizationTasks.map((task) => (
                    <Card key={task.id} className={task.completed ? "bg-green-50 border-green-200" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5" />
                            )}
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <Badge variant="outline" className="mt-2">
                                {task.category}
                              </Badge>
                            </div>
                          </div>
                          <Badge className={getImpactColor(task.impact)}>{task.impact}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Hub Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Content Suggestions
                </CardTitle>
                <CardDescription>
                  AI-generated content ideas to boost engagement and build thought leadership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentSuggestions.map((suggestion, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline">{suggestion.type}</Badge>
                          <span className="text-sm text-gray-500">{suggestion.bestTime}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                        <p className="text-gray-600 mb-3">{suggestion.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">{suggestion.expectedEngagement}</span>
                          <Button size="sm">Use Template</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Optimal posting schedule for maximum engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="p-2 bg-gray-50 rounded">
                      <p className="font-medium text-sm">{day}</p>
                      <p className="text-xs text-gray-600">9:00 AM</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Engagement Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <p className="text-gray-500">Engagement chart would appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="font-medium text-sm">5 Tech Trends for 2024</p>
                      <p className="text-xs text-gray-600">234 reactions • 45 comments</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="font-medium text-sm">Remote Work Best Practices</p>
                      <p className="text-xs text-gray-600">189 reactions • 32 comments</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="font-medium text-sm">Career Growth Tips</p>
                      <p className="text-xs text-gray-600">156 reactions • 28 comments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Networking Tab */}
          <TabsContent value="networking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Smart Networking
                </CardTitle>
                <CardDescription>Strategic networking recommendations based on your industry and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Ethical Networking:</strong> Focus on building genuine professional relationships. Avoid
                    automated connection requests or mass messaging.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Daily Networking Goals</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Send 3-5 personalized connection requests
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Engage with 10-15 posts in your industry
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        Share one valuable piece of content
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Connection Opportunities</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Industry professionals in your area</span>
                        <Badge>12 found</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Alumni from your university</span>
                        <Badge>8 found</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">People who viewed your profile</span>
                        <Badge>5 found</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
