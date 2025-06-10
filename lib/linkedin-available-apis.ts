// What's actually available from LinkedIn APIs for personal profiles

interface AvailableLinkedInData {
  // ✅ From Sign In with LinkedIn (OpenID Connect)
  basicProfile: {
    id: string
    firstName: string
    lastName: string
    profilePicture?: string
    email?: string
  }

  // ❌ NOT AVAILABLE from any LinkedIn API
  unavailableData: {
    profileViews: "Not available to third-party apps"
    connections: "Not available to third-party apps"
    postAnalytics: "Not available to third-party apps"
    whoViewedProfile: "Not available to third-party apps"
    searchAppearances: "Not available to third-party apps"
    profileStrength: "Not available to third-party apps"
  }
}

export class LinkedInAvailableAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // ✅ This works - basic profile from OpenID Connect
  async getBasicProfile() {
    try {
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      })

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching basic profile:", error)
      return null
    }
  }

  // ✅ This works - email address
  async getEmail() {
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
        throw new Error(`LinkedIn Email API error: ${response.status}`)
      }

      const data = await response.json()
      return data.elements?.[0]?.["handle~"]?.emailAddress || null
    } catch (error) {
      console.error("Error fetching email:", error)
      return null
    }
  }

  // ❌ These DON'T work - would need special partnership
  async getProfileAnalytics() {
    throw new Error("Profile analytics not available to third-party applications")
  }

  async getConnections() {
    throw new Error("Connection data not available to third-party applications")
  }

  async getPostMetrics() {
    throw new Error("Post metrics not available to third-party applications")
  }
}
