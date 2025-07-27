// src/lib/authOptions.ts
// This file defines the NextAuth.js configuration.

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
// import EmailProvider from 'next-auth/providers/email'; // Uncomment if using email/passwordless login
// import { SupabaseAdapter } from '@next-auth/supabase-adapter'; // If integrating with Supabase for NextAuth
// import { createClient } from './supabase/server'; // For Supabase adapter

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    // If you are using Supabase as your database for NextAuth.js, you would use an adapter:
    // SupabaseAdapter({
    //   url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string, // This is a sensitive key, use server-side only
    // }),
  ],
  // Optional: Add a database adapter if you want to persist user data
  // database: process.env.DATABASE_URL, // Not needed if using SupabaseAdapter

  // Optional: Callbacks for custom behavior
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist the OAuth access_token and user id to the JWT token after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string;
      return session;
    },
    // Add redirect callback if you need custom redirects after sign-in/out
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`
    //   // Allows external callback URLs
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // }
  },
  // Optional: Pages for custom authentication flows
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email provider)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (after email verification if needed)
  },
  // Optional: Session configuration
  session: {
    strategy: 'jwt', // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Optional: Debugging
  debug: process.env.NODE_ENV === 'development',
  // Optional: Secret for signing JWTs.
  secret: process.env.NEXTAUTH_SECRET,
};

