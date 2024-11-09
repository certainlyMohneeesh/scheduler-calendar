import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async redirect() {
      return '/calendar'
    }
  }
})
export { handler as GET, handler as POST }
