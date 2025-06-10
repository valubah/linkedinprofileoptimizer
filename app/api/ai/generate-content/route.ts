import { type NextRequest, NextResponse } from "next/server"
import { AIService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, audience, tone, length, includeHashtags, includeEmojis, template } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const aiService = new AIService()

    const contentRequest = {
      topic,
      audience: audience || "professionals",
      tone: tone || "professional",
      length: length || "medium",
      includeHashtags: includeHashtags !== false,
      includeEmojis: includeEmojis !== false,
    }

    const result = await aiService.generateContent(contentRequest)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("AI content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
