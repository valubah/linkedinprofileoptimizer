"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Users,
  TrendingUp,
  Activity,
  Bell,
  RefreshCw,
  Zap,
  Award,
  MessageSquare,
  Share2,
  ThumbsUp,
} from "lucide-react"

interface RealTimeMetrics {
  profileViews: {
    today: number
    yesterday: number
    thisWeek: number
    lastWeek: number
    trend: number
  }
  connections: {
    total: number
    pending: number
    todayAdded: number
    weeklyGrowth: number
  }
  engagement: {
    totalLikes: number
    totalComments: number
    totalShares: number
    engagementRate: number
    topPost: string
  }
  notifications: Array<{
    id: string
    type: "view" | "connection" | "engagement" | "mention"
    message: string
    timestamp: Date
    read: boolean
  }>
}

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    profileViews: {
      today: 23,
      yesterday: 18,
      thisWeek: 156,
      lastWeek: 134,
      trend: 16.4,
    },
    connections: {
      total: 1247,
      pending: 8,
      todayAdded: 3,
      weeklyGrowth: 12.5,
    },
    engagement: {
      totalLikes: 234,
      totalComments: 45,
      totalShares: 12,
      engagementRate: 4.7,
      topPost: "5 Tech Trends Shaping 2024",
    },
    notifications: [
      {
        id: "1",
        type: "view",
        message: "Sarah Chen from Google viewed your profile",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
      },
      {
        id: "2",
        type: "connection",
        message: "Michael Rodriguez accepted your connection request",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        read: false,
      },
      {
        id: "3",
        type: "engagement",
        message: "Your post received 15 new likes",
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
      },
    ],
  })

  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setMetrics((prev) => {
        const shouldUpdate = Math.random() > 0.7 // 30% chance of update

        if (!shouldUpdate) return prev

        const updateType = Math.random()
        const newMetrics = { ...prev }

        if (updateType < 0.4) {
          // Profile view update
          newMetrics.profileViews.today += 1
          newMetrics.profileViews.thisWeek += 1
          newMetrics.profileViews.trend =
            ((newMetrics.profileViews.today - prev.profileViews.yesterday) / prev.profileViews.yesterday) * 100

          // Add notification
          newMetrics.notifications.unshift({
            id: Date.now().toString(),
            type: "view",
            message: `${["John Smith", "Emily Johnson", "David Chen", "Lisa Wang"][Math.floor(Math.random() * 4)]} viewed your profile`,
            timestamp: new Date(),
            read: false,
          })
        } else if (updateType < 0.7) {
          // Engagement update
          const engagementType = Math.random()
          if (engagementType < 0.5) {
            newMetrics.engagement.totalLikes += Math.floor(Math.random() * 3) + 1
          } else if (engagementType < 0.8) {
            newMetrics.engagement.totalComments += 1
          } else {
            newMetrics.engagement.totalShares += 1
          }

          newMetrics.notifications.unshift({
            id: Date.now().toString(),
            type: "engagement",
            message: "Your recent post gained new engagement",
            timestamp: new Date(),
            read: false,
          })
        } else {
          // Connection update
          if (Math.random() > 0.5) {
            newMetrics.connections.todayAdded += 1
            newMetrics.connections.total += 1
            newMetrics.notifications.unshift({
              id: Date.now().toString(),
              type: "connection",
              message: "New connection request accepted",
              timestamp: new Date(),
              read: false,
            })
          }
        }

        // Keep only last 10 notifications
        newMetrics.notifications = newMetrics.notifications.slice(0, 10)

        return newMetrics
      })

      setLastUpdate(new Date())
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const unreadNotifications = metrics.notifications.filter((n) => !n.read).length

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="w-4 h-4 text-blue-600" />
      case "connection":
        return <Users className="w-4 h-4 text-green-600" />
      case "engagement":
        return <ThumbsUp className="w-4 h-4 text-purple-600" />
      case "mention":
        return <MessageSquare className="w-4 h-4 text-orange-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="font-medium">{isLive ? "Live Tracking Active" : "Live Tracking Paused"}</span>
          <span className="text-sm text-gray-600">Last update: {formatTimeAgo(lastUpdate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
            {isLive ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">{metrics.profileViews.today}</p>
                <p className="text-xs text-green-600 mt-1">+{metrics.profileViews.trend.toFixed(1)}% vs yesterday</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>This week: {metrics.profileViews.thisWeek}</span>
                <span>Last week: {metrics.profileViews.lastWeek}</span>
              </div>
              <Progress
                value={(metrics.profileViews.thisWeek / (metrics.profileViews.lastWeek || 1)) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connections</p>
                <p className="text-2xl font-bold">{metrics.connections.total.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+{metrics.connections.todayAdded} today</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Pending: {metrics.connections.pending}</span>
                <span>Weekly growth: +{metrics.connections.weeklyGrowth}%</span>
              </div>
              <Progress value={metrics.connections.weeklyGrowth} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{metrics.engagement.engagementRate}%</p>
                <p className="text-xs text-blue-600 mt-1">Above industry avg</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium">{metrics.engagement.totalLikes}</div>
                  <div className="text-gray-600">Likes</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{metrics.engagement.totalComments}</div>
                  <div className="text-gray-600">Comments</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{metrics.engagement.totalShares}</div>
                  <div className="text-gray-600">Shares</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold">{unreadNotifications}</p>
                <p className="text-xs text-orange-600 mt-1">Unread updates</p>
              </div>
              <div className="relative">
                <Bell className="w-8 h-8 text-orange-600" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>Real-time updates on your LinkedIn activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {metrics.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      notification.read ? "bg-gray-50" : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Profile Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Find New Connections
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Industry News
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Views</span>
                  <span>{metrics.profileViews.today}/30</span>
                </div>
                <Progress value={(metrics.profileViews.today / 30) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Connections</span>
                  <span>{metrics.connections.todayAdded}/5</span>
                </div>
                <Progress value={(metrics.connections.todayAdded / 5) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Post Engagement</span>
                  <span>{metrics.engagement.totalLikes}/100</span>
                </div>
                <Progress value={(metrics.engagement.totalLikes / 100) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
