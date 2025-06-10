"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Plus,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
} from "lucide-react"

interface ProfileData {
  // Basic Info
  firstName: string
  lastName: string
  headline: string
  location: string
  industry: string
  summary: string
  profilePicture: string
  backgroundImage: string

  // Contact Info
  email: string
  phone: string
  website: string

  // Experience
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>

  // Education
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    startDate: string
    endDate: string
    description: string
  }>

  // Skills
  skills: Array<{
    name: string
    endorsements: number
  }>

  // Accomplishments
  certifications: Array<{
    name: string
    issuer: string
    date: string
    url?: string
  }>

  languages: Array<{
    name: string
    proficiency: string
  }>

  // Additional
  volunteering: Array<{
    organization: string
    role: string
    cause: string
    startDate: string
    endDate: string
    description: string
  }>
}

interface ProfileAnalysis {
  overallScore: number
  completeness: number
  keywordOptimization: number
  professionalPresence: number
  networkingPotential: number
  recommendations: Array<{
    category: string
    issue: string
    suggestion: string
    impact: "high" | "medium" | "low"
    priority: number
  }>
}

export function ProfileDataCollector() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    headline: "",
    location: "",
    industry: "",
    summary: "",
    profilePicture: "",
    backgroundImage: "",
    email: "",
    phone: "",
    website: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    volunteering: [],
  })

  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [optimizedContent, setOptimizedContent] = useState<any>(null)

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addSkill = (skillName: string) => {
    if (skillName.trim() && !profileData.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: skillName.trim(), endorsements: 0 }],
      }))
    }
  }

  const removeSkill = (skillName: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.name !== skillName),
    }))
  }

  const calculateProfileScore = (): ProfileAnalysis => {
    let score = 0
    let completeness = 0
    const recommendations: ProfileAnalysis["recommendations"] = []

    // Basic Info (30 points)
    if (profileData.firstName && profileData.lastName) score += 5
    if (profileData.headline && profileData.headline.length > 20) score += 10
    else
      recommendations.push({
        category: "Headline",
        issue: "Headline is missing or too short",
        suggestion: "Create a compelling headline with keywords and value proposition (120+ characters)",
        impact: "high",
        priority: 1,
      })

    if (profileData.summary && profileData.summary.length > 100) score += 10
    else
      recommendations.push({
        category: "Summary",
        issue: "Summary is missing or too brief",
        suggestion: "Write a comprehensive summary (200+ words) telling your professional story",
        impact: "high",
        priority: 2,
      })

    if (profileData.location) score += 3
    if (profileData.industry) score += 2

    // Experience (25 points)
    if (profileData.experience.length > 0) {
      score += 15
      const hasDetailedExperience = profileData.experience.some((exp) => exp.description && exp.description.length > 50)
      if (hasDetailedExperience) score += 10
      else
        recommendations.push({
          category: "Experience",
          issue: "Experience descriptions are too brief",
          suggestion: "Add detailed descriptions with achievements and quantifiable results",
          impact: "high",
          priority: 3,
        })
    } else {
      recommendations.push({
        category: "Experience",
        issue: "No work experience added",
        suggestion: "Add your work experience with detailed descriptions",
        impact: "high",
        priority: 1,
      })
    }

    // Education (10 points)
    if (profileData.education.length > 0) score += 10

    // Skills (15 points)
    if (profileData.skills.length >= 5) score += 10
    else
      recommendations.push({
        category: "Skills",
        issue: `Only ${profileData.skills.length} skills listed`,
        suggestion: "Add at least 10-15 relevant skills to improve searchability",
        impact: "medium",
        priority: 4,
      })

    if (profileData.skills.length >= 10) score += 5

    // Contact Info (10 points)
    if (profileData.email) score += 3
    if (profileData.website) score += 4
    if (profileData.phone) score += 3

    // Additional (10 points)
    if (profileData.certifications.length > 0) score += 5
    if (profileData.languages.length > 0) score += 3
    if (profileData.volunteering.length > 0) score += 2

    // Calculate completeness
    const totalFields = 15 // Approximate number of important fields
    let filledFields = 0
    if (profileData.firstName) filledFields++
    if (profileData.lastName) filledFields++
    if (profileData.headline) filledFields++
    if (profileData.summary) filledFields++
    if (profileData.location) filledFields++
    if (profileData.industry) filledFields++
    if (profileData.experience.length > 0) filledFields++
    if (profileData.education.length > 0) filledFields++
    if (profileData.skills.length > 0) filledFields++
    if (profileData.email) filledFields++
    if (profileData.website) filledFields++
    if (profileData.certifications.length > 0) filledFields++
    if (profileData.languages.length > 0) filledFields++
    if (profileData.volunteering.length > 0) filledFields++

    completeness = Math.round((filledFields / totalFields) * 100)

    // Keyword optimization (simplified)
    const keywordOptimization =
      profileData.headline && profileData.summary ? Math.min(85, 60 + profileData.skills.length * 2) : 40

    return {
      overallScore: Math.min(score, 100),
      completeness,
      keywordOptimization,
      professionalPresence: Math.min(90, score + 10),
      networkingPotential: Math.min(95, score + 15),
      recommendations: recommendations.sort((a, b) => a.priority - b.priority),
    }
  }

  const analyzeProfile = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const profileAnalysis = calculateProfileScore()
    setAnalysis(profileAnalysis)

    // Generate optimized content
    const optimized = await generateOptimizedContent()
    setOptimizedContent(optimized)

    setIsAnalyzing(false)
  }

  const generateOptimizedContent = async () => {
    // Simulate AI content optimization
    const optimizedHeadline = profileData.headline
      ? `${profileData.headline} | Driving Innovation & Growth | ${profileData.industry} Expert`
      : `${profileData.industry} Professional | Passionate about Innovation & Excellence`

    const optimizedSummary = profileData.summary
      ? `🚀 ${profileData.summary}\n\n✨ Key Strengths:\n• ${profileData.skills
          .slice(0, 3)
          .map((s) => s.name)
          .join(
            "\n• ",
          )}\n\n🎯 I'm passionate about driving results and building meaningful professional relationships. Let's connect!`
      : `Experienced ${profileData.industry} professional with a passion for innovation and excellence.\n\n✨ Key Strengths:\n• ${profileData.skills
          .slice(0, 3)
          .map((s) => s.name)
          .join(
            "\n• ",
          )}\n\n🎯 I'm passionate about driving results and building meaningful professional relationships. Let's connect!`

    return {
      headline: optimizedHeadline,
      summary: optimizedSummary,
      experience: profileData.experience.map((exp) => ({
        ...exp,
        description: exp.description
          ? `🎯 ${exp.description}\n\n📈 Key Achievements:\n• [Add specific achievement with numbers]\n• [Add another quantifiable result]\n• [Add third accomplishment]`
          : `🎯 [Describe your role and responsibilities]\n\n📈 Key Achievements:\n• [Add specific achievement with numbers]\n• [Add another quantifiable result]\n• [Add third accomplishment]`,
      })),
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Content copied to clipboard! You can now paste it into your LinkedIn profile.")
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Profile Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome back, {profileData.firstName || "User"}!</CardTitle>
              <CardDescription>
                {analysis
                  ? `Your profile is ${analysis.overallScore}% optimized`
                  : "Complete your profile information to get your optimization score"}
              </CardDescription>
            </div>
            {analysis && (
              <div className={`text-center p-4 rounded-lg ${getScoreBg(analysis.overallScore)}`}>
                <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Profile Score</div>
              </div>
            )}
          </div>
          {analysis && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{analysis.completeness}%</div>
                <div className="text-xs text-gray-600">Completeness</div>
                <Progress value={analysis.completeness} className="h-2 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{analysis.keywordOptimization}%</div>
                <div className="text-xs text-gray-600">SEO Score</div>
                <Progress value={analysis.keywordOptimization} className="h-2 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{analysis.professionalPresence}%</div>
                <div className="text-xs text-gray-600">Professional</div>
                <Progress value={analysis.professionalPresence} className="h-2 mt-1" />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{analysis.networkingPotential}%</div>
                <div className="text-xs text-gray-600">Networking</div>
                <Progress value={analysis.networkingPotential} className="h-2 mt-1" />
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          <TabsTrigger value="optimized">Optimized</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your core profile information that appears at the top of your LinkedIn profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => updateProfileData("firstName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => updateProfileData("lastName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline *</Label>
                <Input
                  id="headline"
                  value={profileData.headline}
                  onChange={(e) => updateProfileData("headline", e.target.value)}
                  placeholder="Senior Software Engineer | Full Stack Developer | Tech Innovation Leader"
                  maxLength={220}
                />
                <div className="text-xs text-gray-500">{profileData.headline.length}/220 characters</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => updateProfileData("location", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={profileData.industry}
                    onChange={(e) => updateProfileData("industry", e.target.value)}
                    placeholder="Technology"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary *</Label>
                <Textarea
                  id="summary"
                  value={profileData.summary}
                  onChange={(e) => updateProfileData("summary", e.target.value)}
                  placeholder="Write a compelling summary that tells your professional story, highlights your key achievements, and shows your personality. Include your passions, expertise, and what makes you unique..."
                  rows={6}
                  maxLength={2600}
                />
                <div className="text-xs text-gray-500">{profileData.summary.length}/2600 characters</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => updateProfileData("email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => updateProfileData("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => updateProfileData("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                  <CardDescription>
                    Add your work experience with detailed descriptions and achievements
                  </CardDescription>
                </div>
                <Button onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileData.experience.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No work experience added yet</p>
                  <p className="text-sm">Click "Add Experience" to get started</p>
                </div>
              ) : (
                profileData.experience.map((exp, index) => (
                  <Card key={exp.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => removeExperience(exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title *</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="Tech Company Inc."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`current-${exp.id}`}
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            />
                            <Label htmlFor={`current-${exp.id}`} className="text-sm">
                              I currently work here
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your role, responsibilities, and key achievements. Use bullet points and include quantifiable results where possible..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                  <CardDescription>Add your educational background</CardDescription>
                </div>
                <Button onClick={addEducation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileData.education.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No education added yet</p>
                  <p className="text-sm">Click "Add Education" to get started</p>
                </div>
              ) : (
                profileData.education.map((edu, index) => (
                  <Card key={edu.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>School *</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                            placeholder="University of California, Berkeley"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                            placeholder="Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                          placeholder="Relevant coursework, achievements, activities, honors..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Skills & Expertise
              </CardTitle>
              <CardDescription>
                Add skills relevant to your industry and role. Aim for 10-15 skills for better searchability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkill((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ""
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add a skill"]') as HTMLInputElement
                    if (input) {
                      addSkill(input.value)
                      input.value = ""
                    }
                  }}
                >
                  Add Skill
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <Badge key={skill.name} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {skill.name}
                    <button onClick={() => removeSkill(skill.name)} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              {profileData.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No skills added yet</p>
                  <p className="text-sm">Add skills to improve your profile's searchability</p>
                </div>
              )}

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Include a mix of technical skills, soft skills, and industry-specific
                  expertise. Skills with more endorsements appear higher in search results.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...profileData.certifications]
                            updated[index].name = e.target.value
                            updateProfileData("certifications", updated)
                          }}
                        />
                        <Input
                          placeholder="Issuing Organization"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...profileData.certifications]
                            updated[index].issuer = e.target.value
                            updateProfileData("certifications", updated)
                          }}
                        />
                        <Input
                          type="month"
                          placeholder="Issue Date"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...profileData.certifications]
                            updated[index].date = e.target.value
                            updateProfileData("certifications", updated)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateProfileData("certifications", [
                        ...profileData.certifications,
                        { name: "", issuer: "", date: "", url: "" },
                      ])
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profileData.languages.map((lang, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Language"
                          value={lang.name}
                          onChange={(e) => {
                            const updated = [...profileData.languages]
                            updated[index].name = e.target.value
                            updateProfileData("languages", updated)
                          }}
                        />
                        <select
                          className="p-2 border rounded"
                          value={lang.proficiency}
                          onChange={(e) => {
                            const updated = [...profileData.languages]
                            updated[index].proficiency = e.target.value
                            updateProfileData("languages", updated)
                          }}
                        >
                          <option value="">Proficiency</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Limited Working">Limited Working</option>
                          <option value="Professional Working">Professional Working</option>
                          <option value="Full Professional">Full Professional</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateProfileData("languages", [...profileData.languages, { name: "", proficiency: "" }])
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimized Content Tab */}
        <TabsContent value="optimized" className="space-y-6">
          {!analysis ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Optimize?</h3>
                <p className="text-gray-500 text-center mb-4">
                  Fill out your profile information and click "Analyze Profile" to get AI-powered optimization
                  suggestions.
                </p>
                <Button onClick={analyzeProfile} disabled={isAnalyzing} size="lg">
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze & Optimize Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>Priority improvements to boost your profile performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{rec.category}</h4>
                          <Badge
                            className={
                              rec.impact === "high"
                                ? "bg-red-100 text-red-800"
                                : rec.impact === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.issue}</p>
                        <p className="text-sm font-medium">{rec.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Content */}
              {optimizedContent && (
                <div className="space-y-6">
                  {/* Optimized Headline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Optimized Headline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-2">Original:</p>
                          <p className="text-gray-600">{profileData.headline || "No headline provided"}</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="font-medium mb-2">AI-Optimized:</p>
                          <p className="text-blue-800">{optimizedContent.headline}</p>
                        </div>
                        <Button onClick={() => copyToClipboard(optimizedContent.headline)} className="w-full">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Optimized Headline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimized Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Optimized Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium mb-2">Original:</p>
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {profileData.summary || "No summary provided"}
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="font-medium mb-2">AI-Optimized:</p>
                          <p className="text-blue-800 whitespace-pre-wrap">{optimizedContent.summary}</p>
                        </div>
                        <Button onClick={() => copyToClipboard(optimizedContent.summary)} className="w-full">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Optimized Summary
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimized Experience */}
                  {optimizedContent.experience.map((exp: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Optimized Experience: {exp.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium mb-2">Original:</p>
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {profileData.experience[index]?.description || "No description provided"}
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium mb-2">AI-Optimized:</p>
                            <p className="text-blue-800 whitespace-pre-wrap">{exp.description}</p>
                          </div>
                          <Button onClick={() => copyToClipboard(exp.description)} className="w-full">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Optimized Description
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Next Steps:</strong> Copy the optimized content above and paste it into your LinkedIn profile.
                  Remember to personalize it further and add specific numbers/achievements where indicated.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Analyze Button (shown when not on optimized tab) */}
      {activeTab !== "optimized" && (
        <Card>
          <CardContent className="flex items-center justify-center py-6">
            <Button onClick={analyzeProfile} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analyze & Optimize Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
