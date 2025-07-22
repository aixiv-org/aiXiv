# Clerk Authentication Setup

This guide will help you set up Clerk authentication for your aiXiv React application.

## Prerequisites

1. A Clerk account (sign up at [clerk.com](https://clerk.com))
2. Node.js and npm installed

## Setup Steps

### 1. Create a Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add Application"
3. Choose "React" as your framework
4. Give your application a name (e.g., "aiXiv")
5. Select your preferred authentication methods (Email, Google, GitHub, etc.)

### 2. Get Your Publishable Key

1. In your Clerk dashboard, go to "API Keys"
2. Copy your "Publishable Key" (starts with `pk_test_` or `pk_live_`)

### 3. Configure Environment Variables

1. Create a `.env` file in the `ui` directory:
   ```bash
   cd ui
   cp env.example .env
   ```

2. Edit the `.env` file and replace the placeholder with your actual publishable key:
   ```
   REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### 4. Configure Authentication Settings

In your Clerk dashboard:

1. **Sign-in & Sign-up**: Configure which authentication methods you want to enable
2. **User Profile**: Customize the user profile fields
3. **Redirect URLs**: Add your development and production URLs
   - Development: `http://localhost:3000/*`
   - Production: `https://your-domain.com/*`

### 5. Start the Application

```bash
npm start
```

## Features Implemented

- **Sign In/Sign Up**: Custom styled authentication pages
- **Protected Routes**: Certain pages require authentication
- **User Menu**: Shows user profile and sign out option
- **Automatic Redirects**: Unauthenticated users are redirected to sign-in

## Protected Routes

The following routes require authentication:
- `/submit` - Submit new papers
- `/workspace/*` - User workspace
- `/notifications` - User notifications
- `/profile/:id` - User profiles

## Public Routes

These routes are accessible without authentication:
- `/` - Home page
- `/explore` - Browse papers
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- `/api` - API documentation
- `/submission/:id` - View paper details
- `/about` - About page

## Customization

You can customize the authentication UI by modifying:
- `src/components/SignIn.js` - Sign in page styling
- `src/components/SignUp.js` - Sign up page styling
- `src/components/Header.js` - User menu and authentication buttons

## Troubleshooting

1. **"Missing Publishable Key" error**: Make sure your `.env` file is in the `ui` directory and contains the correct key
2. **Authentication not working**: Check that your redirect URLs are configured correctly in Clerk dashboard
3. **Styling issues**: Ensure Tailwind CSS is properly configured

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your API keys
- Monitor authentication logs in your Clerk dashboard 