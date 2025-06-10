import { type NextRequest, NextResponse } from "next/server"
import { LinkedInAPI } from "@/lib/linkedin-api"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Access token is required" }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)

    // Initialize LinkedIn API client
    const linkedinAPI = new LinkedInAPI()
    linkedinAPI.setAccessToken(accessToken)

    try {
      // Fetch user profile data
      const [profile, emailAddress, analytics, profilePicture] = await Promise.all([
        linkedinAPI.getProfile().catch((error) => {
          console.error("Error fetching profile:", error)
          return null
        }),
        linkedinAPI.getEmailAddress().catch((error) => {
          console.error("Error fetching email:", error)
          return null
        }),
        linkedinAPI.getAnalytics().catch((error) => {
          console.error("Error fetching analytics:", error)
          return null
        }),
        linkedinAPI.getProfilePicture().catch((error) => {
          console.error("Error fetching profile picture:", error)
          return null
        }),
      ])

      if (!profile) {
        throw new Error("Failed to fetch LinkedIn profile data")
      }

      // Return success response with profile data
      return NextResponse.json({
        success: true,
        profile: {
          ...profile,
          emailAddress,
          analytics,
          profilePicture,
        },
      })
    } catch (error) {
      console.error("LinkedIn API error:", error)

      // Return error response
      return NextResponse.json(
        {
          error: "Failed to fetch profile data",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
