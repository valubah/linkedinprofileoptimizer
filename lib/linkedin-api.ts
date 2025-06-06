interface LinkedInAuthResponse {
  access_token: string
  expires_in: number
  scope: string
}

interface LinkedInProfile {
  id: string
  firstName: { localized: { [key: string]: string } }
  lastName: { localized: { [key: string]: string } }
  headline: { localized: { [key: string]: string } }
  profilePicture?: {
    displayImage: string
  }
}

export class LinkedInAPI {
  private accessToken: string | null = null
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor(clientId = "77tx1bsnmw6fpj", clientSecret = "WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==", redirectUri: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
  }

  async exchangeCodeForToken(code: string): Promise<LinkedInAuthResponse> {
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to exchange code for token")
    }

    const data = await response.json()
    this.accessToken = data.access_token
    return data
  }

  async getProfile(): Promise<LinkedInProfile> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(
      "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams))",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return response.json()
  }

  async getProfileViews(): Promise<any> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    // Note: This endpoint requires special permissions
    const response = await fetch(
      "https://api.linkedin.com/v2/networkSizes/urn:li:person:PERSON_ID?edgeType=CompanyFollowedByMember",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch profile views")
    }

    return response.json()
  }

  async shareContent(content: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: "urn:li:person:PERSON_ID",
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to share content")
    }

    return response.json()
  }
}
