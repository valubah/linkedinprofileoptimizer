import { type NextRequest, NextResponse } from "next/server"
import { LinkedInAPI } from "@/lib/linkedin-api"

const LINKEDIN_CLIENT_ID = "77tx1bsnmw6fpj"
const LINKEDIN_CLIENT_SECRET = "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng=="

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Determine redirect URI to match exactly what's in LinkedIn app
    let redirectUri = ""
    const host = request.headers.get("host") || ""

    if (host.includes("v0-linkedinoptimizer.vercel.app")) {
      redirectUri = "https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback"
    } else if (host.includes("profileptimizer.vercel.app")) {
      redirectUri = "https://profileptimizer.vercel.app/auth/linkedin/callback"
    } else {
      redirectUri = "http://localhost:3000/auth/linkedin/callback"
    }

    console.log("API using redirect URI:", redirectUri)

    // Initialize LinkedIn API
    const linkedinAPI = new LinkedInAPI(LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, redirectUri)

    // Exchange authorization code for access token
    const tokenData = await linkedinAPI.exchangeCodeForToken(code)
    const accessToken = tokenData.access_token

    // Set access token for subsequent API calls
    linkedinAPI.setAccessToken(accessToken)

    // Fetch comprehensive user data
    const [profile, emailAddress, analytics] = await Promise.all([
      linkedinAPI.getProfile(),
      linkedinAPI.getEmailAddress(),
      linkedinAPI.getAnalytics(),
    ])

    // Return success response with comprehensive profile data
    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        emailAddress,
        analytics,
      },
      accessToken, // In production, store this securely server-side
    })
  } catch (error) {
    console.error("LinkedIn authentication error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during authentication",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
