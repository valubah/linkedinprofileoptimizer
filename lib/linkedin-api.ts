interface LinkedInAuthResponse {
  access_token: string
  expires_in: number
  scope: string
}

interface LinkedInProfile {
  id: string
  firstName: { localized: { [key: string]: string } }
  lastName: { localized: { [key: string]: string } }
  headline?: { localized: { [key: string]: string } }
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

interface LinkedInEmailResponse {
  elements: Array<{
    handle: string
    "handle~": {
      emailAddress: string
    }
  }>
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
      const errorText = await response.text()
      console.error("LinkedIn token exchange failed:", errorText)
      throw new Error(`Failed to exchange code for token: ${errorText}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    return data
  }

  async getProfile(): Promise<LinkedInProfile> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    try {
      // Using the v2 API with OpenID Connect
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("LinkedIn profile fetch failed:", errorText)
        throw new Error(`Failed to fetch profile: ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error)
      throw error
    }
  }

  async getProfilePicture(): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch(
        "https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (!response.ok) {
        console.error("Failed to fetch profile picture")
        return null
      }

      const data = await response.json()
      const profilePicture = data.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier
      return profilePicture || null
    } catch (error) {
      console.error("Error fetching profile picture:", error)
      return null
    }
  }

  async getEmailAddress(): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    try {
      // Using the v2 API with OpenID Connect
      const response = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (!response.ok) {
        console.error("Failed to fetch email address")
        return null
      }

      const data: LinkedInEmailResponse = await response.json()
      return data.elements?.[0]?.["handle~"]?.emailAddress || null
    } catch (error) {
      console.error("Error fetching email address:", error)
      return null
    }
  }

  // Fetch analytics data - this would require additional permissions in a real app
  async getAnalytics(): Promise<any> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    // In a real implementation, you would fetch analytics data from LinkedIn's API
    // For now, we'll return mock data
    return {
      profileViews: Math.floor(Math.random() * 100) + 50,
      searchAppearances: Math.floor(Math.random() * 50) + 20,
      postImpressions: Math.floor(Math.random() * 5000) + 1000,
      connections: Math.floor(Math.random() * 1000) + 500,
    }
  }

  // Share content to LinkedIn - this would require additional permissions in a real app
  async shareContent(content: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error("No access token available")
    }

    // In a real implementation, you would post to LinkedIn's API
    // For now, we'll simulate a successful response
    return {
      id: `post-${Date.now()}`,
      status: "success",
    }
  }
}
