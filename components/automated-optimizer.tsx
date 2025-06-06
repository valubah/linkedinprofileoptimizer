"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Zap, CheckCircle, Clock, AlertTriangle, Sparkles, Target, Loader2 } from "lucide-react"

interface OptimizationTask {
  id: string
  type: "headline" | "summary" | "skills" | "content" | "connections"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "failed"
  suggestion: string
  autoApply?: boolean
}

interface AutomatedOptimizerProps {
  profile: any
  accessToken: string
}

export function AutomatedOptimizer({ profile, accessToken }: AutomatedOptimizerProps) {
  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  useEffect(() => {
    analyzeAndGenerateTasks()
  }, [profile])

  const analyzeAndGenerateTasks = async () => {
    setIsAnalyzing(true)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const tasks: OptimizationTask[] = []

    // Headline optimization
    if (!profile.headline || profile.headline.length < 50) {
      tasks.push({
        id: "headline-opt",
        type: "headline",
        title: "Optimize Professional Headline",
        description: "Your headline could be more compelling and keyword-rich",
        impact: "high",
        status: "pending",
        suggestion: `${profile.positions[0]?.title || "Professional"} | Industry Expert | Helping companies grow through innovation`,
        autoApply: true,
      })
    }

    // Summary optimization
    if (!profile.summary || profile.summary.length < 200) {
      tasks.push({
        id: "summary-opt",
        type: "summary",
        title: "Enhance Professional Summary",
        description: "A compelling summary can increase profile views by 40%",
        impact: "high",
        status: "pending",
        suggestion: `Experienced ${profile.positions[0]?.title || "Professional"} with proven track record in driving results...`,
        autoApply: false,
      })
    }

    // Skills optimization
    if (profile.skills.length < 10) {
      tasks.push({
        id: "skills-opt",
        type: "skills",
        title: "Add Relevant Skills",
        description: "Profiles with 10+ skills get 13x more views",
        impact: "medium",
        status: "pending",
        suggestion: "Leadership, Project Management, Strategic Planning, Data Analysis, Team Building",
        autoApply: true,
      })
    }

    // Content strategy
    tasks.push({
      id: "content-strategy",
      type: "content",
      title: "Automated Content Suggestions",
      description: "Get personalized content ideas based on your industry",
      impact: "high",
      status: "pending",
      suggestion: "Share industry insights, career tips, and professional achievements",
      autoApply: false,
    })

    // Network growth
    if (profile.connections < 500) {
      tasks.push({
        id: "network-growth",
        type: "connections",
        title: "Strategic Network Expansion",
        description: "Identify and connect with relevant professionals",
        impact: "medium",
        status: "pending",
        suggestion: "Connect with colleagues, industry leaders, and potential collaborators",
        autoApply: false,
      })
    }

    setOptimizationTasks(tasks)
    setIsAnalyzing(false)
  }

  const applyOptimization = async (taskId: string) => {
    setOptimizationTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "in-progress" } : task)))

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setOptimizationTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
  }

  const applySelectedOptimizations = async () => {
    for (const taskId of selectedTasks) {
      await applyOptimization(taskId)
    }
    setSelectedTasks([])
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const completedTasks = optimizationTasks.filter((task) => task.status === "completed").length
  const totalTasks = optimizationTasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <div>
              <h3 className="font-medium">Analyzing Your Profile</h3>
              <p className="text-sm text-gray-600">Generating personalized optimization recommendations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Optimization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Automated Optimization
          </CardTitle>
          <CardDescription>AI-powered recommendations to maximize your LinkedIn presence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-Optimization</h4>
              <p className="text-sm text-gray-600">Automatically apply safe optimizations</p>
            </div>
            <Switch checked={autoOptimizeEnabled} onCheckedChange={setAutoOptimizeEnabled} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Optimization Progress</span>
              <span>
                {completedTasks}/{totalTasks} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          {selectedTasks.length > 0 && (
            <Button onClick={applySelectedOptimizations} className="w-full">
              Apply Selected Optimizations ({selectedTasks.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Optimization Tasks */}
      <div className="space-y-4">
        {optimizationTasks.map((task) => (
          <Card key={task.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTasks([...selectedTasks, task.id])
                      } else {
                        setSelectedTasks(selectedTasks.filter((id) => id !== task.id))
                      }
                    }}
                    disabled={task.status === "completed" || task.status === "in-progress"}
                    className="rounded"
                  />
                  {getStatusIcon(task.status)}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge className={getImpactColor(task.impact)}>{task.impact} impact</Badge>
                  </div>

                  <p className="text-sm text-gray-600">{task.description}</p>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-700">Suggested Optimization:</Label>
                    <Textarea value={task.suggestion} readOnly className="mt-1 text-sm resize-none" rows={2} />
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => applyOptimization(task.id)}
                        disabled={task.status === "in-progress"}
                      >
                        {task.autoApply ? (
                          <>
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Apply
                          </>
                        ) : (
                          "Apply Manually"
                        )}
                      </Button>
                    )}

                    {task.status === "completed" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    )}

                    {task.status === "in-progress" && (
                      <Badge variant="secondary">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Applying...
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-connect with relevant professionals</Label>
                <p className="text-xs text-gray-600">Send 5-10 connection requests daily</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-engage with industry content</Label>
                <p className="text-xs text-gray-600">Like and comment on relevant posts</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly content suggestions</Label>
                <p className="text-xs text-gray-600">Get personalized post ideas</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Profile optimization alerts</Label>
                <p className="text-xs text-gray-600">Get notified of new opportunities</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
