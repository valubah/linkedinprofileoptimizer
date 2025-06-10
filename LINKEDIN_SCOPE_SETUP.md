# LinkedIn App Scope Configuration Guide

## 🚨 Current Issue: Email Scope Not Authorized

The error "Scope 'r_emailaddress' is not authorized for your application" means your LinkedIn app needs additional products/permissions.

## ✅ Solution: Add LinkedIn Products

### Step 1: Go to LinkedIn Developer Console
1. Visit [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)
2. Select your app: **Profile Optimizer** (Client ID: 77tx1bsnmw6fpj)

### Step 2: Navigate to Products Tab
Click on the **"Products"** tab in your app dashboard.

### Step 3: Add Required Products
Request access to these LinkedIn products:

#### 🔹 Sign In with LinkedIn using OpenID Connect
- **Status**: Should be approved automatically
- **Provides**: Basic profile info, email
- **Scopes**: `openid`, `profile`, `email`

#### 🔹 Share on LinkedIn  
- **Status**: May require approval
- **Provides**: Ability to post content
- **Scopes**: `w_member_social`

#### 🔹 Marketing Developer Platform
- **Status**: Requires approval process
- **Provides**: Advanced analytics, company data
- **Scopes**: `r_organization_social`, `rw_organization_admin`

## 🔄 Updated Code Changes

I've updated the code to use **OpenID Connect scopes** which are more reliable:

### Old Scopes (Problematic):
\`\`\`
r_liteprofile r_emailaddress w_member_social r_organization_social
\`\`\`

### New Scopes (Working):
\`\`\`
openid profile email
\`\`\`

## 📋 Next Steps

1. **Add "Sign In with LinkedIn using OpenID Connect"** product to your app
2. **Wait for approval** (usually instant for OpenID Connect)
3. **Test the authentication** again
4. **Gradually add more products** as needed for advanced features

## 🔍 Verification

After adding the products, you should see them listed in your app's Products tab with "Approved" status.
