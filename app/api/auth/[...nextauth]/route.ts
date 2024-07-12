import NextAuth from "next-auth/next";
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/app/libs/prismadb";

const handler = NextAuth({
  providers: [
    GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  secret: process.env.NEXT_AUTH_SECRET,

  session: {
    strategy: "jwt"
  },
  adapter: PrismaAdapter(prisma) as Adapter,

  callbacks : {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("signin callback: ", user, account, profile, email, credentials)
  
      return true
    },
    async jwt({ token, account, profile }) {
    // Persist the OAuth access_token and or the user id to the token right after signin
      
      // console.log("jwt callback: ", token, account, profile)
      return token
    },

    async session({ session, token, user }) {
    // Send properties to the client, like an access_token and user id from a provider.
      // console.log("session callback: ",session, token, user)

      if (session && session.user) {
        session.user.id = token.sub || "not logged in"
      }

    
    return session 
  }
    
  },

  debug: process.env.NODE_ENV === "development",
})
     
export { handler as GET, handler as POST }