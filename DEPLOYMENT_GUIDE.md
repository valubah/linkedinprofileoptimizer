# LinkedIn Profile Optimizer - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Step 1: Deploy to Vercel
1. Click the "Deploy" button in v0 or push to GitHub
2. Connect your GitHub repository to Vercel
3. Your app will be deployed to: `https://your-app-name.vercel.app`

### Step 2: Set Environment Variables in Vercel
Go to your Vercel dashboard → Project Settings → Environment Variables and add:

\`\`\`
LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
LINKEDIN_CLIENT_SECRET=WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=77tx1bsnmw6fpj
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
\`\`\`

### Step 3: Configure LinkedIn App
1. Go to [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)
2. Select your app (Client ID: 77tx1bsnmw6fpj)
3. Go to "Auth" tab
4. Add these Redirect URLs:
   - `http://localhost:3000/auth/linkedin/callback` (for development)
   - `https://your-app-name.vercel.app/auth/linkedin/callback` (for production)

## 🌐 Production URLs

### Automatic URL Generation
The app automatically detects the environment:
- **Development**: `http://localhost:3000`
- **Production**: `https://your-app-name.vercel.app` (auto-detected from Vercel)

### Custom Domain (Optional)
If you want a custom domain:
1. Add your domain in Vercel dashboard
2. Update `NEXT_PUBLIC_APP_URL` to your custom domain
3. Update LinkedIn redirect URL to your custom domain

## 🔧 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `LINKEDIN_CLIENT_ID` | Your LinkedIn app client ID | `77tx1bsnmw6fpj` |
| `LINKEDIN_CLIENT_SECRET` | Your LinkedIn app secret | `WPL_AP1.YLKwaKrvp5fL4zpc.1GyPng==` |
| `NEXT_PUBLIC_LINKEDIN_CLIENT_ID` | Public client ID for frontend | `77tx1bsnmw6fpj` |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL | `https://your-app.vercel.app` |

## ✅ Verification Steps

1. **Deploy the app** to Vercel
2. **Note your production URL** (e.g., `https://linkedin-optimizer-abc123.vercel.app`)
3. **Update LinkedIn app** with the production redirect URL
4. **Test the authentication** flow in production
5. **Verify all features** work correctly

## 🔒 Security Notes

- Environment variables are automatically secured in Vercel
- LinkedIn OAuth uses HTTPS in production
- All API calls are server-side for security
- Access tokens are handled securely

## 🐛 Troubleshooting

### Common Issues:
1. **Redirect URI mismatch**: Ensure LinkedIn app has correct URLs
2. **Environment variables**: Check they're set in Vercel dashboard
3. **CORS issues**: Ensure proper domain configuration
4. **OAuth errors**: Verify client ID and secret are correct

### Debug Mode:
The app shows current environment and redirect URI on the connection page for debugging.
