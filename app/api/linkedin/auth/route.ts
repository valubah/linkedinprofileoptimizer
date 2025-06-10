import { type NextRequest, NextResponse } from "next/server"
import { LinkedInAPI } from "@/lib/linkedin-api"

// Use environment variables or fallback to hardcoded values
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || "77tx1bsnmw6fpj"
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng=="

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Determine redirect URI to match exactly what's in LinkedIn app
    let redirectUri = ""
    const host = request.headers.get("host") || ""
    const origin = request.headers.get("origin") || ""

    // Log debugging information
    console.log("Host:", host)
    console.log("Origin:", origin)

    if (host.includes("v0-linkedinoptimizer.vercel.app")) {
      redirectUri = "https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback"
    } else if (host.includes("profileptimizer.vercel.app")) {
      redirectUri = "https://profileptimizer.vercel.app/auth/linkedin/callback"
    } else {
      // Default to localhost for development
      redirectUri = "http://localhost:3000/auth/linkedin/callback"
    }

    console.log("Using redirect URI:", redirectUri)

    // Initialize LinkedIn API client
    const linkedinAPI = new LinkedInAPI(LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, redirectUri)

    try {
      // Exchange authorization code for access token
      const tokenData = await linkedinAPI.exchangeCodeForToken(code)
      const accessToken = tokenData.access_token

      // Set access token for subsequent API calls
      linkedinAPI.setAccessToken(accessToken)

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
        accessToken,
      })
    } catch (error) {
      console.error("LinkedIn API error:", error)

      // If we can't get real data, fall back to mock data
      const mockProfile = {
        id: "linkedin-user-123",
        firstName: { localized: { en_US: "John" } },
        lastName: { localized: { en_US: "Doe" } },
        headline: { localized: { en_US: "Senior Software Engineer | Full Stack Developer | Tech Enthusiast" } },
        vanityName: "johndoe",
        emailAddress: "john.doe@example.com",
        profilePicture: "/placeholder.svg?height=100&width=100",
        analytics: {
          profileViews: 89,
          connections: 1248,
          postImpressions: 3420,
        },
        isMockData: true,
      }

      return NextResponse.json({
        success: true,
        profile: mockProfile,
        accessToken: "mock-token",
        isMockData: true,
        warning:
          "Using mock data due to API limitations. " + (error instanceof Error ? error.message : "Unknown error"),
      })
    }
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
