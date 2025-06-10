import { type NextRequest, NextResponse } from "next/server"
import { LinkedInRealAPI } from "@/lib/linkedin-real-api"

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "77tx1bsnmw6fpj"
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng=="

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Determine redirect URI
    const host = request.headers.get("host") || ""
    let redirectUri = ""

    if (host.includes("v0-linkedinoptimizer.vercel.app")) {
      redirectUri = "https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback"
    } else if (host.includes("profileptimizer.vercel.app")) {
      redirectUri = "https://profileptimizer.vercel.app/auth/linkedin/callback"
    } else {
      redirectUri = "http://localhost:3000/auth/linkedin/callback"
    }

    console.log("Using redirect URI:", redirectUri)

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("LinkedIn token exchange failed:", errorText)
      throw new Error(`Token exchange failed: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Initialize LinkedIn API client with real access token
    const linkedinAPI = new LinkedInRealAPI(accessToken)

    // Fetch available real data
    const [basicProfile, emailAddress, profilePicture] = await Promise.all([
      linkedinAPI.getBasicProfile(),
      linkedinAPI.getEmailAddress(),
      linkedinAPI.getProfilePicture(),
    ])

    if (!basicProfile) {
      throw new Error("Failed to fetch basic profile data from LinkedIn")
    }

    // Create response with real data where available, mock data for unavailable metrics
    const profileData = {
      // ✅ Real data from LinkedIn API
      id: basicProfile.id,
      firstName: basicProfile.firstName,
      lastName: basicProfile.lastName,
      emailAddress: emailAddress,
      profilePicture: profilePicture || "/placeholder.svg?height=100&width=100",

      // ❌ Mock data for unavailable metrics (LinkedIn doesn't provide these anymore)
      analytics: {
        profileViews: Math.floor(Math.random() * 100) + 50,
        connections: Math.floor(Math.random() * 1000) + 500,
        postImpressions: Math.floor(Math.random() * 5000) + 1000,
      },

      // Metadata
      dataSource: {
        realData: ["id", "firstName", "lastName", "emailAddress", "profilePicture"],
        mockData: ["analytics", "connections", "profileViews", "postImpressions"],
      },
    }

    return NextResponse.json({
      success: true,
      profile: profileData,
      accessToken,
      isPartialReal: true,
      message:
        "Successfully connected! Using real profile data where available, simulated analytics due to LinkedIn API limitations.",
    })
  } catch (error) {
    console.error("LinkedIn authentication error:", error)

    // Fallback to full mock data
    const mockProfile = {
      id: "mock-user-123",
      firstName: { localized: { en_US: "John" } },
      lastName: { localized: { en_US: "Doe" } },
      emailAddress: "john.doe@example.com",
      profilePicture: "/placeholder.svg?height=100&width=100",
      analytics: {
        profileViews: 89,
        connections: 1248,
        postImpressions: 3420,
      },
      dataSource: {
        realData: [],
        mockData: ["all"],
      },
    }

    return NextResponse.json({
      success: true,
      profile: mockProfile,
      accessToken: "mock-token",
      isFullMock: true,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Authentication failed, using demo data. LinkedIn API access is very limited for third-party apps.",
    })
  }
}
