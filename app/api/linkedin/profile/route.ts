import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Access token is required" }, { status: 401 })
    }

    const accessToken = authHeader.substring(7)

    // Fetch comprehensive profile data
    const [profileResponse, emailResponse] = await Promise.all([
      fetch(
        "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,location,industry,profilePicture(displayImage~:playableStreams))",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      ),
      fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }),
    ])

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile from LinkedIn")
    }

    const profileData = await profileResponse.json()

    let emailAddress = null
    if (emailResponse.ok) {
      const emailData = await emailResponse.json()
      emailAddress = emailData.elements?.[0]?.["handle~"]?.emailAddress
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profileData,
        emailAddress,
      },
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
