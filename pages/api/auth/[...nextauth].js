import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";

import clientPromise from "../../../database/connectDB";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Let NextAuth handle the redirect automatically
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allow redirects to the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Default fallback to homepage
      return baseUrl
    },
  },
  // Make sure the baseUrl matches what's configured in Google Cloud Console
  // This should be http://localhost:3001 for local development
});
