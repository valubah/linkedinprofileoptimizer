interface LinkedInRealProfile {
  id: string
  firstName: { localized: { [key: string]: string } }
  lastName: { localized: { [key: string]: string } }
  profilePicture?: {
    displayImage: string
  }
}

interface LinkedInEmailResponse {
  elements: Array<{
    "handle~": {
      emailAddress: string
    }
  }>
}

export class LinkedInRealAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  // ✅ AVAILABLE: Basic profile information
  async getBasicProfile(): Promise<LinkedInRealProfile | null> {
    try {
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      })

      if (!response.ok) {
        console.error("LinkedIn API Error:", response.status, response.statusText)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error)
      return null
    }
  }

  // ✅ AVAILABLE: Email address (with email scope)
  async getEmailAddress(): Promise<string | null> {
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
        console.error("LinkedIn Email API Error:", response.status, response.statusText)
        return null
      }

      const data: LinkedInEmailResponse = await response.json()
      return data.elements?.[0]?.["handle~"]?.emailAddress || null
    } catch (error) {
      console.error("Error fetching LinkedIn email:", error)
      return null
    }
  }

  // ✅ AVAILABLE: Profile picture (with additional projection)
  async getProfilePicture(): Promise<string | null> {
    try {
      const response = await fetch(
        "https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        },
      )

      if (!response.ok) {
        console.error("LinkedIn Profile Picture API Error:", response.status, response.statusText)
        return null
      }

      const data = await response.json()
      const elements = data.profilePicture?.["displayImage~"]?.elements

      if (elements && elements.length > 0) {
        // Get the largest available image
        const largestImage = elements.reduce((prev: any, current: any) => {
          const prevSize = prev.data?.["com.linkedin.digitalmedia.mediaartifact.StillImage"]?.storageSize?.width || 0
          const currentSize =
            current.data?.["com.linkedin.digitalmedia.mediaartifact.StillImage"]?.storageSize?.width || 0
          return currentSize > prevSize ? current : prev
        })

        return largestImage.identifiers?.[0]?.identifier || null
      }

      return null
    } catch (error) {
      console.error("Error fetching LinkedIn profile picture:", error)
      return null
    }
  }

  // ❌ NOT AVAILABLE: These would require special partnership
  async getAnalytics(): Promise<null> {
    console.warn("LinkedIn Analytics API is not available for third-party applications")
    return null
  }

  async getConnections(): Promise<null> {
    console.warn("LinkedIn Connections API is not available for third-party applications")
    return null
  }

  async getProfileViews(): Promise<null> {
    console.warn("LinkedIn Profile Views API is not available for third-party applications")
    return null
  }
}
