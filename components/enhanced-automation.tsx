"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Zap,
  Users,
  MessageCircle,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
} from "lucide-react"

interface AutomationSettings {
  dailyConnections: number
  dailyEngagements: number
  contentFrequency: number
  targetIndustries: string[]
  autoPost: boolean
  smartTiming: boolean
  networkGrowth: boolean
  contentOptimization: boolean
}

interface AutomationStats {
  connectionsToday: number
  engagementsToday: number
  profileViews: number
  postReach: number
  networkGrowth: number
}

export function EnhancedAutomation({ profile, accessToken }: { profile: any; accessToken: string }) {
  const [isActive, setIsActive] = useState(false)
  const [settings, setSettings] = useState<AutomationSettings>({
    dailyConnections: 10,
    dailyEngagements: 15,
    contentFrequency: 3,
    targetIndustries: [profile.industry],
    autoPost: false,
    smartTiming: true,
    networkGrowth: true,
    contentOptimization: true,
  })

  const [stats, setStats] = useState<AutomationStats>({
    connectionsToday: 7,
    engagementsToday: 12,
    profileViews: 45,
    postReach: 1250,
    networkGrowth: 15,
  })

  const [automationTasks, setAutomationTasks] = useState([
    {
      id: "morning-engagement",
      name: "Morning Engagement Round",
      status: "completed",
      time: "09:00 AM",
      actions: ["Liked 5 posts", "Commented on 2 posts", "Shared 1 article"],
    },
    {
      id: "connection-outreach",
      name: "Strategic Connection Outreach",
      status: "in-progress",
      time: "11:30 AM",
      actions: ["Sent 3 connection requests", "Personalized messages sent"],
    },
    {
      id: "content-optimization",
      name: "Content Performance Analysis",
      status: "pending",
      time: "02:00 PM",
      actions: ["Analyze post performance", "Generate content suggestions"],
    },
    {
      id: "evening-networking",
      name: "Evening Network Activity",
      status: "scheduled",
      time: "06:00 PM",
      actions: ["Engage with connections", "Join group discussions"],
    },
  ])

  const toggleAutomation = () => {
    setIsActive(!isActive)
  }

  const updateSettings = (key: keyof AutomationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "in-progress":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      case "scheduled":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Automation Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                LinkedIn Automation Hub
              </CardTitle>
              <CardDescription>Intelligent automation for profile growth and engagement</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isActive ? "default" : "secondary"} className="px-3 py-1">
                {isActive ? "Active" : "Paused"}
              </Badge>
              <Button onClick={toggleAutomation} variant={isActive ? "destructive" : "default"}>
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.connectionsToday}</div>
              <div className="text-sm text-gray-600">Connections Today</div>
              <div className="text-xs text-green-600 mt-1">Target: {settings.dailyConnections}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.engagementsToday}</div>
              <div className="text-sm text-gray-600">Engagements Today</div>
              <div className="text-xs text-green-600 mt-1">Target: {settings.dailyEngagements}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.profileViews}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
              <div className="text-xs text-green-600 mt-1">+{stats.networkGrowth}% this week</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.postReach}</div>
              <div className="text-sm text-gray-600">Post Reach</div>
              <div className="text-xs text-green-600 mt-1">Last 7 days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Automation Settings
            </CardTitle>
            <CardDescription>Configure your automation preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Daily Connection Requests</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.dailyConnections]}
                    onValueChange={(value) => updateSettings("dailyConnections", value[0])}
                    max={20}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span className="font-medium">{settings.dailyConnections} per day</span>
                    <span>20</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Daily Engagements</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.dailyEngagements]}
                    onValueChange={(value) => updateSettings("dailyEngagements", value[0])}
                    max={30}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span className="font-medium">{settings.dailyEngagements} per day</span>
                    <span>30</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Weekly Content Posts</Label>
                <div className="mt-2">
                  <Slider
                    value={[settings.contentFrequency]}
                    onValueChange={(value) => updateSettings("contentFrequency", value[0])}
                    max={7}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-medium">{settings.contentFrequency} per week</span>
                    <span>7</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Target Industries</Label>
                <Select
                  value={settings.targetIndustries[0]}
                  onValueChange={(value) => updateSettings("targetIndustries", [value])}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Smart Timing</Label>
                  <p className="text-xs text-gray-600">Post and engage at optimal times</p>
                </div>
                <Switch
                  checked={settings.smartTiming}
                  onCheckedChange={(checked) => updateSettings("smartTiming", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Post Content</Label>
                  <p className="text-xs text-gray-600">Automatically publish approved content</p>
                </div>
                <Switch
                  checked={settings.autoPost}
                  onCheckedChange={(checked) => updateSettings("autoPost", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Network Growth Focus</Label>
                  <p className="text-xs text-gray-600">Prioritize connection building</p>
                </div>
                <Switch
                  checked={settings.networkGrowth}
                  onCheckedChange={(checked) => updateSettings("networkGrowth", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Content Optimization</Label>
                  <p className="text-xs text-gray-600">AI-powered content suggestions</p>
                </div>
                <Switch
                  checked={settings.contentOptimization}
                  onCheckedChange={(checked) => updateSettings("contentOptimization", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Automation Schedule
            </CardTitle>
            <CardDescription>Automated tasks and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automationTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">{getStatusIcon(task.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <span className="text-xs text-gray-500">{task.time}</span>
                    </div>
                    <div className={`text-xs font-medium mb-2 ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </div>
                    <div className="space-y-1">
                      {task.actions.map((action, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Next Scheduled Action</h4>
              <p className="text-sm text-gray-600">Content Performance Analysis at 2:00 PM</p>
              <Progress value={65} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">65% of daily automation completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Safety & Compliance
          </CardTitle>
          <CardDescription>Automation follows LinkedIn's terms of service and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Rate Limiting</h4>
                <p className="text-xs text-gray-600">Respects LinkedIn's API limits and usage guidelines</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Human-like Behavior</h4>
                <p className="text-xs text-gray-600">Randomized timing and natural interaction patterns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Quality Focus</h4>
                <p className="text-xs text-gray-600">Prioritizes meaningful connections over quantity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
