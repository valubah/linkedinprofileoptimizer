"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Target, Zap, Clock, CheckCircle } from "lucide-react"

const profileViewsData = [
  { day: "Mon", views: 45 },
  { day: "Tue", views: 52 },
  { day: "Wed", views: 48 },
  { day: "Thu", views: 61 },
  { day: "Fri", views: 55 },
  { day: "Sat", views: 38 },
  { day: "Sun", views: 42 },
]

const engagementData = [
  { day: "Mon", likes: 12, comments: 3, shares: 1 },
  { day: "Tue", likes: 18, comments: 5, shares: 2 },
  { day: "Wed", likes: 15, comments: 4, shares: 1 },
  { day: "Thu", likes: 22, comments: 7, shares: 3 },
  { day: "Fri", likes: 19, comments: 6, shares: 2 },
  { day: "Sat", likes: 14, comments: 2, shares: 1 },
  { day: "Sun", likes: 16, comments: 4, shares: 2 },
]

const connectionSourceData = [
  { name: "Search", value: 35, color: "#3b82f6" },
  { name: "Mutual Connections", value: 28, color: "#10b981" },
  { name: "Groups", value: 20, color: "#f59e0b" },
  { name: "Content", value: 17, color: "#ef4444" },
]

export function RealTimeDashboard({ profile }: { profile: any }) {
  const [liveStats, setLiveStats] = useState({
    profileViews: 1247,
    connections: 892,
    followers: 1456,
    postImpressions: 8934,
    engagementRate: 12.4,
    searchAppearances: 456,
  })

  const [recentActivity, setRecentActivity] = useState([
    { type: "connection", message: "New connection with Sarah Johnson", time: "2 minutes ago", icon: Users },
    { type: "view", message: "Profile viewed by Tech Recruiter", time: "5 minutes ago", icon: Eye },
    { type: "engagement", message: "Your post received 3 new likes", time: "8 minutes ago", icon: Heart },
    { type: "message", message: "New message from potential client", time: "12 minutes ago", icon: MessageCircle },
    { type: "share", message: "Your article was shared 2 times", time: "15 minutes ago", icon: Share2 },
  ])

  const [automationStatus, setAutomationStatus] = useState({
    connectionsToday: 7,
    engagementsToday: 12,
    postsScheduled: 3,
    tasksCompleted: 8,
    nextAction: "Content optimization at 2:00 PM",
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update stats to simulate real-time changes
      if (Math.random() > 0.7) {
        setLiveStats((prev) => ({
          ...prev,
          profileViews: prev.profileViews + Math.floor(Math.random() * 3),
          postImpressions: prev.postImpressions + Math.floor(Math.random() * 10),
        }))
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    const iconMap = {
      connection: Users,
      view: Eye,
      engagement: Heart,
      message: MessageCircle,
      share: Share2,
    }
    const IconComponent = iconMap[type as keyof typeof iconMap] || Users
    return <IconComponent className="h-4 w-4" />
  }

  const getActivityColor = (type: string) => {
    const colorMap = {
      connection: "text-blue-500",
      view: "text-green-500",
      engagement: "text-red-500",
      message: "text-purple-500",
      share: "text-orange-500",
    }
    return colorMap[type as keyof typeof colorMap] || "text-gray-500"
  }

  return (
    <div className="space-y-6">
      {/* Live Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">{liveStats.profileViews.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connections</p>
                <p className="text-2xl font-bold">{liveStats.connections.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />+{automationStatus.connectionsToday} today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{liveStats.engagementRate}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Above average
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Views Trend</CardTitle>
            <CardDescription>Daily profile views over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profileViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Likes, comments, and shares by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="likes" fill="#ef4444" />
                <Bar dataKey="comments" fill="#3b82f6" />
                <Bar dataKey="shares" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity and Automation Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time updates from your LinkedIn profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Automation Status
            </CardTitle>
            <CardDescription>Current automation performance and next actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{automationStatus.connectionsToday}</div>
                <div className="text-xs text-gray-600">Connections Today</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{automationStatus.engagementsToday}</div>
                <div className="text-xs text-gray-600">Engagements Today</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily Progress</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Next Action</span>
              </div>
              <p className="text-sm text-gray-600">{automationStatus.nextAction}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{automationStatus.tasksCompleted} automation tasks completed today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Sources</CardTitle>
          <CardDescription>Where your new connections are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={connectionSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {connectionSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {connectionSourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
