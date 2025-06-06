"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lightbulb, Target, TrendingUp, User, Briefcase } from "lucide-react"

interface ProfileData {
  headline: string
  summary: string
  experience: string
  skills: string
  industry: string
}

interface OptimizationSuggestion {
  category: string
  suggestion: string
  impact: "high" | "medium" | "low"
  icon: React.ReactNode
}

export function ProfileOptimizer() {
  const [profileData, setProfileData] = useState<ProfileData>({
    headline: "",
    summary: "",
    experience: "",
    skills: "",
    industry: "",
  })

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSuggestions = async () => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockSuggestions: OptimizationSuggestion[] = [
      {
        category: "Headline Optimization",
        suggestion:
          "Include specific keywords related to your industry and add quantifiable achievements to make your headline more compelling.",
        impact: "high",
        icon: <Target className="w-4 h-4" />,
      },
      {
        category: "Summary Enhancement",
        suggestion:
          "Start with a strong opening statement, include 2-3 key accomplishments with numbers, and end with a call-to-action.",
        impact: "high",
        icon: <User className="w-4 h-4" />,
      },
      {
        category: "Skills Optimization",
        suggestion: "Add trending skills in your industry and ensure you have endorsements for your top 5 skills.",
        impact: "medium",
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        category: "Experience Details",
        suggestion:
          "Use action verbs, quantify your achievements, and include relevant keywords for better searchability.",
        impact: "high",
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        category: "Profile Completeness",
        suggestion: "Add a professional photo, customize your LinkedIn URL, and include relevant certifications.",
        impact: "medium",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    ]

    setSuggestions(mockSuggestions)
    setIsAnalyzing(false)
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

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Profile Input</TabsTrigger>
          <TabsTrigger value="suggestions">Optimization Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Enter Your LinkedIn Profile Information
              </CardTitle>
              <CardDescription>
                Fill in your current LinkedIn profile details to get personalized optimization suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Software Development, Marketing, Finance"
                    value={profileData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headline">Current Headline</Label>
                  <Input
                    id="headline"
                    placeholder="Your current LinkedIn headline"
                    value={profileData.headline}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Your current LinkedIn summary/about section"
                  rows={4}
                  value={profileData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Recent Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your most recent work experience"
                  rows={3}
                  value={profileData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Current Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="List your current skills (comma-separated)"
                  rows={2}
                  value={profileData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                />
              </div>

              <Button
                onClick={generateSuggestions}
                disabled={isAnalyzing || !profileData.headline || !profileData.summary}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Optimization Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          {suggestions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Lightbulb className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Suggestions Yet</h3>
                <p className="text-gray-500 text-center">
                  Fill in your profile information and click "Get Optimization Suggestions" to see personalized
                  recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Optimization Roadmap</h2>
                <p className="text-gray-600">Implement these suggestions to boost your LinkedIn profile performance</p>
              </div>

              {suggestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">{suggestion.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{suggestion.category}</h3>
                          <Badge className={getImpactColor(suggestion.impact)}>{suggestion.impact} impact</Badge>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{suggestion.suggestion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Implement high-impact suggestions first</li>
                    <li>• Update your profile gradually over time</li>
                    <li>• Monitor your profile views and connection requests</li>
                    <li>• Re-run this analysis after making changes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
