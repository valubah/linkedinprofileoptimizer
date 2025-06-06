"use server"

interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  location: {
    name: string
    country: string
  }
  industry: string
  positions: Array<{
    title: string
    company: string
    startDate: string
    endDate?: string
    description: string
  }>
  skills: Array<{
    name: string
    endorsements: number
  }>
  connections: number
  followers: number
}

interface LinkedInPost {
  id: string
  text: string
  publishedAt: string
  likes: number
  comments: number
  shares: number
  impressions: number
}

export async function authenticateLinkedIn(code: string) {
  try {
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: "77tx1bsnmw6fpj",
        client_secret: "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==",
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/linkedin/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Authentication failed")
    }

    return { success: true, accessToken: tokenData.access_token }
  } catch (error) {
    console.error("LinkedIn authentication error:", error)
    return { success: false, error: "Authentication failed" }
  }
}

export async function fetchLinkedInProfile(accessToken: string): Promise<LinkedInProfile | null> {
  try {
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,location,industry,positions,skills)",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile")
    }

    const profileData = await profileResponse.json()

    // Fetch additional metrics
    const metricsResponse = await fetch("https://api.linkedin.com/v2/networkSizes/urn:li:person:" + profileData.id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const metricsData = await metricsResponse.json()

    return {
      id: profileData.id,
      firstName: profileData.firstName.localized.en_US,
      lastName: profileData.lastName.localized.en_US,
      headline: profileData.headline,
      summary: profileData.summary,
      location: profileData.location,
      industry: profileData.industry,
      positions: profileData.positions?.elements || [],
      skills: profileData.skills?.elements || [],
      connections: metricsData.firstDegreeSize || 0,
      followers: metricsData.secondDegreeSize || 0,
    }
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error)
    return null
  }
}

export async function fetchLinkedInPosts(accessToken: string): Promise<LinkedInPost[]> {
  try {
    const postsResponse = await fetch("https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:~&count=20", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    const postsData = await postsResponse.json()

    return (
      postsData.elements?.map((post: any) => ({
        id: post.id,
        text: post.text?.text || "",
        publishedAt: post.created?.time,
        likes: post.totalSocialActivityCounts?.numLikes || 0,
        comments: post.totalSocialActivityCounts?.numComments || 0,
        shares: post.totalSocialActivityCounts?.numShares || 0,
        impressions: post.totalSocialActivityCounts?.numViews || 0,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error)
    return []
  }
}

export async function analyzeProfile(profile: LinkedInProfile) {
  const analysis = {
    completeness: 0,
    strengths: [] as string[],
    improvements: [] as string[],
    keywordOptimization: [] as string[],
    engagementPotential: 0,
  }

  // Calculate completeness score
  let completenessScore = 0
  if (profile.headline) completenessScore += 20
  if (profile.summary) completenessScore += 25
  if (profile.positions.length > 0) completenessScore += 20
  if (profile.skills.length >= 5) completenessScore += 15
  if (profile.location) completenessScore += 10
  if (profile.industry) completenessScore += 10

  analysis.completeness = completenessScore

  // Identify strengths
  if (profile.headline && profile.headline.length > 50) {
    analysis.strengths.push("Comprehensive headline")
  }
  if (profile.summary && profile.summary.length > 200) {
    analysis.strengths.push("Detailed professional summary")
  }
  if (profile.positions.length >= 3) {
    analysis.strengths.push("Rich work experience")
  }
  if (profile.skills.length >= 10) {
    analysis.strengths.push("Diverse skill set")
  }

  // Suggest improvements
  if (!profile.headline || profile.headline.length < 50) {
    analysis.improvements.push("Expand your headline with keywords and value proposition")
  }
  if (!profile.summary || profile.summary.length < 200) {
    analysis.improvements.push("Write a more comprehensive professional summary")
  }
  if (profile.skills.length < 10) {
    analysis.improvements.push("Add more relevant skills to your profile")
  }
  if (profile.positions.length === 0) {
    analysis.improvements.push("Add your work experience and achievements")
  }

  // Keyword optimization suggestions
  const industryKeywords = getIndustryKeywords(profile.industry)
  analysis.keywordOptimization = industryKeywords.filter(
    (keyword) =>
      !profile.headline?.toLowerCase().includes(keyword.toLowerCase()) &&
      !profile.summary?.toLowerCase().includes(keyword.toLowerCase()),
  )

  // Calculate engagement potential
  analysis.engagementPotential = Math.min(
    100,
    profile.connections / 10 + profile.skills.length * 2 + profile.positions.length * 5 + completenessScore * 0.5,
  )

  return analysis
}

function getIndustryKeywords(industry: string): string[] {
  const keywordMap: Record<string, string[]> = {
    Technology: ["software", "development", "programming", "innovation", "digital", "AI", "machine learning"],
    Marketing: ["digital marketing", "SEO", "content", "branding", "analytics", "social media"],
    Finance: ["financial analysis", "investment", "risk management", "portfolio", "banking"],
    Healthcare: ["patient care", "medical", "healthcare", "clinical", "treatment"],
    Education: ["teaching", "curriculum", "learning", "education", "training"],
  }

  return keywordMap[industry] || ["leadership", "management", "strategy", "growth", "innovation"]
}

export async function generateOptimizedHeadline(profile: LinkedInProfile) {
  const keywords = getIndustryKeywords(profile.industry)
  const currentRole = profile.positions[0]?.title || "Professional"
  const company = profile.positions[0]?.company || ""

  const templates = [
    `${currentRole} | ${keywords.slice(0, 2).join(" & ")} Expert | Helping companies ${keywords[2] || "grow"}`,
    `${keywords[0]} ${currentRole} | ${company} | ${keywords.slice(1, 3).join(" • ")}`,
    `${currentRole} specializing in ${keywords.slice(0, 2).join(" and ")} | ${keywords[2]} enthusiast`,
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

export async function generateOptimizedSummary(profile: LinkedInProfile) {
  const keywords = getIndustryKeywords(profile.industry)
  const experience = profile.positions.length
  const currentRole = profile.positions[0]?.title || "Professional"

  return `Experienced ${currentRole} with ${experience}+ years in ${profile.industry}. 

Specialized in ${keywords.slice(0, 3).join(", ")}, I help organizations achieve their goals through innovative solutions and strategic thinking.

Key areas of expertise:
• ${keywords[0]} and ${keywords[1]}
• ${keywords[2]} and process optimization
• Team leadership and cross-functional collaboration
• Data-driven decision making

I'm passionate about ${keywords[0]} and always looking to connect with like-minded professionals. Let's discuss how we can create value together.`
}
