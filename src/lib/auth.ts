import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"
import { DefaultSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

interface UserWithPassword {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    password?: string;
  }
}

export const authOptions: NextAuthOptions = {
        adapter: PrismaAdapter(prisma),
          providers: [
            GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
            CredentialsProvider({
              name: "credentials",
              credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                  throw new Error("Missing credentials")
                }
        
        
                const user = await prisma.user.findUnique({
                  where: {
                    email: credentials.email
                  }
                })  as UserWithPassword | null;
        
        
                if (!user || !user.password) {
                  throw new Error("User not found")
                }
        
        
                const isPasswordValid = await compare(credentials.password, user.password)
        
        
                if (!isPasswordValid) {
                  throw new Error("Invalid password")
                }
        
        
                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                }
              }
            })
          ],
                pages: {
                    signIn: '/login',
                    error: '/login',
                },
                session: {
                    strategy: "jwt",
                },
                callbacks: {
                    async redirect({ url, baseUrl }) {
                    // Always redirect to calendar after successful auth
                    return `${baseUrl}/calendar`
                    },
                    session: ({ session, token }) => ({
                    ...session,
                    user: {
                        ...session.user,
                        id: token.sub,
                    },
                    }),
                    jwt: ({ token, user }) => {
                    if (user) {
                        token.sub = user.id
                    }
                    return token
                    },
                },
                }
    
    
    const handler = NextAuth(authOptions)
    export { handler as GET, handler as POST }
