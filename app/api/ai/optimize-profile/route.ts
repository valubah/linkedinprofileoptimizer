import { type NextRequest, NextResponse } from "next/server"
import { AIService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileData } = body

    if (!profileData) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 })
    }

    const aiService = new AIService()
    const result = await aiService.optimizeProfile(profileData)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Profile optimization error:", error)
    return NextResponse.json(
      {
        error: "Failed to optimize profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
