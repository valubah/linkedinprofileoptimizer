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
  vanityName?: string
  location?: {
    name: string
  }
  industry?: {
    name: string
  }
}

interface LinkedInAnalytics {
  profileViews: number
  searchAppearances: number
  postImpressions: number
  connections: number
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

  setAccessToken(token: string) {
    this.accessToken = token
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
      "https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams),vanityName,location,industry)",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return response.json()
  }

  async getEmailAddress(): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.elements?.[0]?.["handle~"]?.emailAddress || null
    } catch {
      return null
    }
  }

  async getConnections(): Promise<number> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    try {
      // Note: This endpoint has limited access, using mock data for now
      return Math.floor(Math.random() * 1000) + 500
    } catch {
      return 0
    }
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
        author: `urn:li:person:${await this.getPersonId()}`,
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

  private async getPersonId(): Promise<string> {
    const profile = await this.getProfile()
    return profile.id
  }

  // Mock analytics data (LinkedIn's analytics API requires special permissions)
  async getAnalytics(): Promise<LinkedInAnalytics> {
    return {
      profileViews: Math.floor(Math.random() * 100) + 50,
      searchAppearances: Math.floor(Math.random() * 50) + 20,
      postImpressions: Math.floor(Math.random() * 5000) + 1000,
      connections: await this.getConnections(),
    }
  }
}
