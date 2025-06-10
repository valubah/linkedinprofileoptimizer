import { type NextRequest, NextResponse } from "next/server"

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

      return NextResponse.json(
        {
          error: "Failed to exchange authorization code",
          details: errorText,
        },
        { status: 400 },
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // For demo purposes, we'll mock the profile data instead of making actual API calls
    // This ensures the app works even if LinkedIn API access is limited
    const mockProfile = {
      id: "linkedin-user-123",
      firstName: { localized: { en_US: "John" } },
      lastName: { localized: { en_US: "Doe" } },
      headline: { localized: { en_US: "Senior Software Engineer | Full Stack Developer | Tech Enthusiast" } },
      vanityName: "johndoe",
      emailAddress: "john.doe@example.com",
      profilePicture: {
        displayImage: "/placeholder.svg?height=100&width=100",
      },
      analytics: {
        profileViews: 89,
        connections: 1248,
        postImpressions: 3420,
      },
    }

    // Return success response with mock profile data
    return NextResponse.json({
      success: true,
      profile: mockProfile,
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
