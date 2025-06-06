"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Bot,
  Target,
  Clock,
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  Brain,
  Shield,
} from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  type: "connection" | "engagement" | "content" | "messaging"
  enabled: boolean
  conditions: string[]
  actions: string[]
  schedule: {
    days: string[]
    timeRange: { start: string; end: string }
  }
  limits: {
    daily: number
    hourly: number
  }
  performance: {
    executed: number
    successful: number
    successRate: number
  }
}

interface AIInsights {
  recommendations: Array<{
    type: string
    title: string
    description: string
    impact: "high" | "medium" | "low"
    confidence: number
  }>
  patterns: Array<{
    pattern: string
    frequency: number
    outcome: string
  }>
  optimizations: Array<{
    area: string
    current: number
    potential: number
    improvement: number
  }>
}

export function AdvancedAutomation() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Smart Connection Requests",
      type: "connection",
      enabled: true,
      conditions: ["Mutual connections > 3", "Same industry", "Profile completeness > 80%"],
      actions: ["Send personalized connection request", "Add to CRM"],
      schedule: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        timeRange: { start: "09:00", end: "17:00" },
      },
      limits: { daily: 10, hourly: 2 },
      performance: { executed: 156, successful: 134, successRate: 85.9 },
    },
    {
      id: "2",
      name: "Intelligent Engagement",
      type: "engagement",
      enabled: true,
      conditions: ["Post from connection", "Industry relevant", "High engagement potential"],
      actions: ["Like post", "Add thoughtful comment", "Share if valuable"],
      schedule: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        timeRange: { start: "08:00", end: "20:00" },
      },
      limits: { daily: 50, hourly: 8 },
      performance: { executed: 423, successful: 398, successRate: 94.1 },
    },
    {
      id: "3",
      name: "Content Amplification",
      type: "content",
      enabled: false,
      conditions: ["Trending topic", "Industry relevance", "Engagement threshold met"],
      actions: ["Auto-share with commentary", "Tag relevant connections"],
      schedule: {
        days: ["Tuesday", "Wednesday", "Thursday"],
        timeRange: { start: "10:00", end: "16:00" },
      },
      limits: { daily: 3, hourly: 1 },
      performance: { executed: 23, successful: 21, successRate: 91.3 },
    },
  ])

  const [aiInsights, setAiInsights] = useState<AIInsights>({
    recommendations: [
      {
        type: "timing",
        title: "Optimize Posting Schedule",
        description: "Your audience is most active on Tuesday and Thursday between 9-11 AM",
        impact: "high",
        confidence: 92,
      },
      {
        type: "content",
        title: "Increase Video Content",
        description: "Video posts generate 3x more engagement than text-only posts",
        impact: "high",
        confidence: 87,
      },
      {
        type: "networking",
        title: "Target Senior Professionals",
        description: "Connections with 10+ years experience have 40% higher response rates",
        impact: "medium",
        confidence: 78,
      },
    ],
    patterns: [
      { pattern: "Tuesday morning posts", frequency: 85, outcome: "23% higher engagement" },
      { pattern: "Question-based content", frequency: 67, outcome: "45% more comments" },
      { pattern: "Industry hashtags", frequency: 92, outcome: "18% better reach" },
    ],
    optimizations: [
      { area: "Connection acceptance rate", current: 76, potential: 89, improvement: 17 },
      { area: "Post engagement rate", current: 4.7, potential: 6.2, improvement: 32 },
      { area: "Profile view conversion", current: 12, potential: 18, improvement: 50 },
    ],
  })

  const [isAutomationActive, setIsAutomationActive] = useState(true)
  const [safetyMode, setSafetyMode] = useState(true)

  const toggleRule = (ruleId: string) => {
    setAutomationRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "connection":
        return <Users className="w-4 h-4" />
      case "engagement":
        return <ThumbsUp className="w-4 h-4" />
      case "content":
        return <Share2 className="w-4 h-4" />
      case "messaging":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Automation Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Automation Control Center
          </CardTitle>
          <CardDescription>Manage your LinkedIn automation with AI-powered insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="automation-active">Master Control</Label>
                  <p className="text-xs text-gray-600">Enable/disable all automation</p>
                </div>
                <Switch id="automation-active" checked={isAutomationActive} onCheckedChange={setIsAutomationActive} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="safety-mode">Safety Mode</Label>
                  <p className="text-xs text-gray-600">Extra conservative limits</p>
                </div>
                <Switch id="safety-mode" checked={safetyMode} onCheckedChange={setSafetyMode} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">94.1%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">602</div>
                <div className="text-sm text-gray-600">Actions Today</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
                <p className="text-xs text-gray-600">Automation running smoothly</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="safety">Safety & Compliance</TabsTrigger>
        </TabsList>

        {/* Automation Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automationRules.map((rule) => (
              <Card key={rule.id} className={rule.enabled ? "border-green-200 bg-green-50" : "border-gray-200"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getTypeIcon(rule.type)}
                      {rule.name}
                    </CardTitle>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                  <CardDescription>
                    Success Rate: {rule.performance.successRate}% ({rule.performance.successful}/
                    {rule.performance.executed})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Conditions</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Actions</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">Daily Limit</Label>
                      <div className="font-medium">{rule.limits.daily}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Hourly Limit</Label>
                      <div className="font-medium">{rule.limits.hourly}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">Schedule</Label>
                    <div className="text-sm">
                      {rule.schedule.days.join(", ")} • {rule.schedule.timeRange.start} - {rule.schedule.timeRange.end}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure Rule
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Create New Automation Rule
              </CardTitle>
              <CardDescription>Set up custom automation based on your specific needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="e.g., Target Tech Executives" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-type">Automation Type</Label>
                  <select id="rule-type" className="w-full p-2 border rounded-md">
                    <option value="connection">Connection Requests</option>
                    <option value="engagement">Post Engagement</option>
                    <option value="content">Content Sharing</option>
                    <option value="messaging">Direct Messaging</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Trigger Conditions</Label>
                <Textarea
                  id="conditions"
                  placeholder="e.g., Profile contains 'CTO' or 'VP Engineering', Company size > 100 employees"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-limit">Daily Limit</Label>
                  <Input id="daily-limit" type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourly-limit">Hourly Limit</Label>
                  <Input id="hourly-limit" type="number" placeholder="2" />
                </div>
              </div>

              <Button className="w-full">
                <Bot className="w-4 h-4 mr-2" />
                Create Automation Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Data-driven suggestions to improve your LinkedIn performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{rec.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getImpactColor(rec.impact)}>{rec.impact} impact</Badge>
                          <Badge variant="outline">{rec.confidence}% confidence</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <Button size="sm" variant="outline">
                        Apply Recommendation
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Optimization Opportunities
                </CardTitle>
                <CardDescription>Areas where you can improve your LinkedIn performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.optimizations.map((opt, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{opt.area}</span>
                        <span className="text-sm text-green-600">+{opt.improvement}% potential</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>Current: {opt.current}%</span>
                        <span>•</span>
                        <span>Potential: {opt.potential}%</span>
                      </div>
                      <Progress value={(opt.current / opt.potential) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Behavioral Patterns
              </CardTitle>
              <CardDescription>AI-detected patterns in your LinkedIn activity and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.patterns.map((pattern, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">{pattern.pattern}</h3>
                    <div className="text-xs text-gray-600 mb-2">Frequency: {pattern.frequency}%</div>
                    <div className="text-sm text-green-600 font-medium">{pattern.outcome}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">602</div>
                <div className="text-sm text-gray-600">Actions Today</div>
                <div className="text-xs text-green-600 mt-1">+23% vs yesterday</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">94.1%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-xs text-green-600 mt-1">Above target</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-gray-600">New Connections</div>
                <div className="text-xs text-green-600 mt-1">This week</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ThumbsUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-gray-600">Engagements</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automation Performance Trends</CardTitle>
              <CardDescription>Track the effectiveness of your automation over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance charts would appear here</p>
                  <p className="text-xs text-gray-400">Showing upward trend with 15% improvement this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety & Compliance Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>LinkedIn Compliance:</strong> All automation features are designed to respect LinkedIn's Terms of
              Service and API rate limits. We use human-like interaction patterns and conservative limits to ensure
              account safety.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Safety Measures
                </CardTitle>
                <CardDescription>Built-in protections to keep your account safe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium text-sm">Rate Limiting</div>
                    <div className="text-xs text-gray-600">Respects LinkedIn's API limits</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium text-sm">Human-like Patterns</div>
                    <div className="text-xs text-gray-600">Randomized timing and behavior</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium text-sm">Content Filtering</div>
                    <div className="text-xs text-gray-600">AI-powered spam detection</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <div className="font-medium text-sm">Account Monitoring</div>
                    <div className="text-xs text-gray-600">24/7 health checks</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Current Limits
                </CardTitle>
                <CardDescription>Your current automation limits and usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Connection Requests</span>
                    <span>7/10</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hourly Engagements</span>
                    <span>5/8</span>
                  </div>
                  <Progress value={62.5} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily Messages</span>
                    <span>3/5</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Content Shares</span>
                    <span>12/15</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Compliance Guidelines
              </CardTitle>
              <CardDescription>Best practices for safe LinkedIn automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">✅ Recommended Practices</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Personalize all connection requests</li>
                    <li>• Engage authentically with relevant content</li>
                    <li>• Maintain consistent but natural activity patterns</li>
                    <li>• Focus on quality over quantity</li>
                    <li>• Respect others' privacy and preferences</li>
                    <li>• Use automation to enhance, not replace, human interaction</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-600">❌ Avoid These Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Mass connection requests without personalization</li>
                    <li>• Automated commenting with generic messages</li>
                    <li>• Excessive daily activity that seems unnatural</li>
                    <li>• Targeting users who haven't shown interest</li>
                    <li>• Sharing irrelevant or promotional content</li>
                    <li>• Ignoring LinkedIn's community guidelines</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
