import { type NextRequest, NextResponse } from "next/server"
import { LinkedInAPI } from "@/lib/linkedin-api"

export async function POST(request: NextRequest) {
  try {
    const { content, accessToken } = await request.json()

    if (!content || !accessToken) {
      return NextResponse.json({ error: "Content and access token are required" }, { status: 400 })
    }

    const linkedinAPI = new LinkedInAPI()
    linkedinAPI.setAccessToken(accessToken)

    const result = await linkedinAPI.shareContent(content)

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: "Content shared successfully",
    })
  } catch (error) {
    console.error("LinkedIn share error:", error)
    return NextResponse.json(
      {
        error: "Failed to share content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
