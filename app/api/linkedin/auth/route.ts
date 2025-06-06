import { type NextRequest, NextResponse } from "next/server"

const LINKEDIN_CLIENT_ID = "77tx1bsnmw6fpj"
const LINKEDIN_CLIENT_SECRET = "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng=="

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // Determine redirect URI based on environment
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    const redirectUri = `${baseUrl}/auth/linkedin/callback`

    console.log("Using redirect URI:", redirectUri) // For debugging

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
      const errorData = await tokenResponse.text()
      console.error("LinkedIn token exchange failed:", errorData)
      return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch user profile information
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    )

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text()
      console.error("LinkedIn profile fetch failed:", errorData)
      return NextResponse.json({ error: "Failed to fetch profile information" }, { status: 400 })
    }

    const profileData = await profileResponse.json()

    // Fetch email address
    const emailResponse = await fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    )

    let emailAddress = null
    if (emailResponse.ok) {
      const emailData = await emailResponse.json()
      emailAddress = emailData.elements?.[0]?.["handle~"]?.emailAddress
    }

    // Return success response with profile data
    return NextResponse.json({
      success: true,
      profile: {
        ...profileData,
        emailAddress,
      },
      accessToken, // In production, store this securely server-side
    })
  } catch (error) {
    console.error("LinkedIn authentication error:", error)
    return NextResponse.json({ error: "Internal server error during authentication" }, { status: 500 })
  }
}
