import { ClerkProvider } from '@clerk/clerk-react';

// You'll need to replace this with your actual Clerk publishable key
// Get this from your Clerk dashboard at https://dashboard.clerk.com
const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your .env file");
}

export function ClerkProviderWrapper({ children }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
} 