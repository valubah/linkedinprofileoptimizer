"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  PenTool,
  Lightbulb,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Copy,
  Share2,
  Edit,
  Sparkles,
  MessageSquare,
} from "lucide-react"

interface ContentTemplate {
  id: string
  title: string
  type: "thought-leadership" | "personal-story" | "industry-insight" | "question" | "announcement"
  template: string
  variables: string[]
  expectedEngagement: {
    likes: number
    comments: number
    shares: number
    views: number
  }
  bestTimes: string[]
  hashtags: string[]
}

interface GeneratedContent {
  id: string
  content: string
  type: string
  score: number
  improvements: string[]
  hashtags: string[]
  scheduledTime?: string
}

export function AIContentGenerator() {
  const [contentTemplates] = useState<ContentTemplate[]>([
    {
      id: "1",
      title: "Industry Insight Post",
      type: "industry-insight",
      template: `🔍 Just noticed an interesting trend in {industry}:

{main_insight}

Here's what this means for professionals in our field:

✅ {implication_1}
✅ {implication_2}
✅ {implication_3}

What's your take on this? Have you seen similar patterns?

{hashtags}`,
      variables: ["industry", "main_insight", "implication_1", "implication_2", "implication_3"],
      expectedEngagement: { likes: 120, comments: 25, shares: 8, views: 2500 },
      bestTimes: ["Tuesday 9:00 AM", "Wednesday 2:00 PM", "Thursday 11:00 AM"],
      hashtags: ["#Industry", "#Trends", "#Innovation", "#ProfessionalDevelopment"],
    },
    {
      id: "2",
      title: "Personal Achievement Story",
      type: "personal-story",
      template: `🎯 {timeframe} ago, I {challenge_faced}.

Today, I'm proud to share that {achievement}.

The journey taught me:

💡 {lesson_1}
💡 {lesson_2}
💡 {lesson_3}

To anyone facing similar challenges: {encouragement}

What's a recent win you're proud of? Share below! 👇

{hashtags}`,
      variables: ["timeframe", "challenge_faced", "achievement", "lesson_1", "lesson_2", "lesson_3", "encouragement"],
      expectedEngagement: { likes: 200, comments: 45, shares: 15, views: 3200 },
      bestTimes: ["Monday 8:00 AM", "Wednesday 1:00 PM", "Friday 3:00 PM"],
      hashtags: ["#Success", "#Growth", "#Motivation", "#CareerJourney"],
    },
    {
      id: "3",
      title: "Thought Leadership Question",
      type: "question",
      template: `🤔 Here's a question that's been on my mind:

{main_question}

I've been thinking about this because {context}.

My initial thoughts:
• {perspective_1}
• {perspective_2}
• {perspective_3}

But I'd love to hear from the community:

{follow_up_question}

Drop your thoughts below - especially interested in hearing from {target_audience}!

{hashtags}`,
      variables: [
        "main_question",
        "context",
        "perspective_1",
        "perspective_2",
        "perspective_3",
        "follow_up_question",
        "target_audience",
      ],
      expectedEngagement: { likes: 150, comments: 80, shares: 12, views: 4000 },
      bestTimes: ["Tuesday 10:00 AM", "Thursday 2:00 PM", "Friday 11:00 AM"],
      hashtags: ["#ThoughtLeadership", "#Discussion", "#Community", "#Innovation"],
    },
  ])

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [contentTopic, setContentTopic] = useState("")
  const [targetAudience, setTargetAudience] = useState("")

  const generateContent = async (template?: ContentTemplate) => {
    setIsGenerating(true)

    // Simulate AI content generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockContent: GeneratedContent = {
      id: Date.now().toString(),
      content: template
        ? `🔍 Just noticed an interesting trend in Software Development:

AI-powered development tools are becoming mainstream, with 67% of developers now using AI assistants for code completion and debugging.

Here's what this means for professionals in our field:

✅ Faster development cycles and reduced time-to-market
✅ More focus on creative problem-solving rather than repetitive tasks
✅ Need for new skills in AI tool integration and prompt engineering

The developers who adapt quickly will have a significant competitive advantage.

What's your take on this? Have you integrated AI tools into your workflow yet?

#SoftwareDevelopment #AI #Innovation #TechTrends #ProfessionalDevelopment`
        : `Based on your topic "${contentTopic}", here's a personalized post:

🚀 The future of ${contentTopic} is evolving rapidly, and here's what I'm seeing:

${customPrompt}

Key insights for ${targetAudience}:
• Embrace continuous learning
• Focus on human-AI collaboration
• Build adaptable skill sets

What trends are you noticing in your field?

#Innovation #Future #Technology #Growth`,
      type: template?.type || "custom",
      score: Math.floor(Math.random() * 20) + 80,
      improvements: [
        "Add more specific data points",
        "Include a call-to-action question",
        "Consider adding relevant hashtags",
      ],
      hashtags: template?.hashtags || ["#Innovation", "#Technology", "#Growth"],
    }

    setGeneratedContent((prev) => [mockContent, ...prev])
    setIsGenerating(false)
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const schedulePost = (contentId: string) => {
    setGeneratedContent((prev) =>
      prev.map((content) => (content.id === contentId ? { ...content, scheduledTime: "Tuesday 9:00 AM" } : content)),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Create engaging LinkedIn content with AI-powered suggestions and proven templates
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Content Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Generation</TabsTrigger>
          <TabsTrigger value="generated">Generated Content</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {contentTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PenTool className="w-4 h-4" />
                    {template.title}
                  </CardTitle>
                  <Badge variant="outline">{template.type}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">{template.template}</div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{template.expectedEngagement.likes}</div>
                      <div className="text-gray-600">Expected Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{template.expectedEngagement.comments}</div>
                      <div className="text-gray-600">Expected Comments</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">Best Times</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.bestTimes.slice(0, 2).map((time, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => generateContent(template)} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Generation Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Custom Content Generation
              </CardTitle>
              <CardDescription>
                Describe your content idea and let AI create a personalized LinkedIn post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-topic">Content Topic</Label>
                  <Input
                    id="content-topic"
                    placeholder="e.g., Remote work trends, AI in healthcare"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Software engineers, Marketing professionals"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Content Description</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Describe what you want to write about, your key points, or any specific angle you want to take..."
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Question Post
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Industry Insight
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Personal Story
                </Button>
              </div>

              <Button
                onClick={() => generateContent()}
                disabled={isGenerating || !contentTopic || !customPrompt}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI is crafting your content...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Custom Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Content Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">📈 Engagement Boosters</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Start with a hook or question</li>
                    <li>• Use emojis strategically</li>
                    <li>• Include 3-5 relevant hashtags</li>
                    <li>• Add a clear call-to-action</li>
                    <li>• Share personal experiences</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">⏰ Timing Optimization</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Tuesday-Thursday: Peak engagement</li>
                    <li>• 8-10 AM: Morning commute time</li>
                    <li>• 12-2 PM: Lunch break browsing</li>
                    <li>• Avoid weekends for B2B content</li>
                    <li>• Test different times for your audience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Content Tab */}
        <TabsContent value="generated" className="space-y-6">
          {generatedContent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PenTool className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Content Generated Yet</h3>
                <p className="text-gray-500 text-center">
                  Use the templates or custom generator to create your first AI-powered LinkedIn post.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {generatedContent.map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generated Content
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{content.type}</Badge>
                        <Badge
                          className={
                            content.score >= 90
                              ? "bg-green-100 text-green-800"
                              : content.score >= 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          Score: {content.score}/100
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-sans">{content.content}</pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{Math.floor(Math.random() * 50) + 100}</div>
                        <div className="text-xs text-gray-600">Expected Likes</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{Math.floor(Math.random() * 20) + 25}</div>
                        <div className="text-xs text-gray-600">Expected Comments</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{Math.floor(Math.random() * 10) + 8}</div>
                        <div className="text-xs text-gray-600">Expected Shares</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {Math.floor(Math.random() * 1000) + 2000}
                        </div>
                        <div className="text-xs text-gray-600">Expected Views</div>
                      </div>
                    </div>

                    {content.improvements.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">AI Suggestions for Improvement</Label>
                        <div className="space-y-1">
                          {content.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <Lightbulb className="w-3 h-3" />
                              {improvement}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Recommended Hashtags</Label>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(content.content)}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        {content.scheduledTime ? (
                          <Badge className="bg-green-100 text-green-800">Scheduled for {content.scheduledTime}</Badge>
                        ) : (
                          <Button size="sm" onClick={() => schedulePost(content.id)}>
                            <Calendar className="w-3 h-3 mr-1" />
                            Schedule
                          </Button>
                        )}
                        <Button size="sm">
                          <Share2 className="w-3 h-3 mr-1" />
                          Post Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
