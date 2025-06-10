# LinkedIn OAuth Debugging Guide

## 🔍 Current Issue: Redirect URI Mismatch

The error "The redirect_uri does not match the registered value" means LinkedIn is receiving a different redirect URI than what's configured in your app.

## ✅ Your LinkedIn App Configuration (Correct)
Based on your screenshots, you have these URLs correctly configured:
- `https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback`
- `https://profileptimizer.vercel.app/auth/linkedin/callback`

## 🔧 Debugging Steps

### 1. Check Browser Console
Open browser dev tools and look for these logs:
\`\`\`
Using redirect URI: https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback
Full auth URL: https://www.linkedin.com/oauth/v2/authorization?...
\`\`\`

### 2. Verify Environment Variables
In Vercel dashboard, ensure these are set for BOTH deployments:

**For v0-linkedinoptimizer.vercel.app:**
\`\`\`
LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
LINKEDIN_CLIENT_SECRET=WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
\`\`\`

**For profileptimizer.vercel.app:**
\`\`\`
LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
LINKEDIN_CLIENT_SECRET=WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
\`\`\`

### 3. Test the OAuth URL Manually
Copy the auth URL from console and paste it directly in browser to see if it works.

### 4. Check LinkedIn App Status
Ensure your LinkedIn app is:
- ✅ Verified
- ✅ Has correct permissions
- ✅ Is not in development mode restrictions

## 🚨 Common Fixes

### Fix 1: Exact URL Match
The redirect URI must match EXACTLY (case-sensitive, no trailing slashes):
- ❌ `https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback/`
- ✅ `https://v0-linkedinoptimizer.vercel.app/auth/linkedin/callback`

### Fix 2: Clear Browser Cache
Clear cookies and cache for LinkedIn.com

### Fix 3: Redeploy After Changes
After updating environment variables, redeploy both Vercel apps.

## 🔄 Testing Checklist
- [ ] Environment variables set in Vercel
- [ ] LinkedIn app has correct redirect URLs
- [ ] Browser console shows correct redirect URI
- [ ] No trailing slashes in URLs
- [ ] LinkedIn app is verified and active
