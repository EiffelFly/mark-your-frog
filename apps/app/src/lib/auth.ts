import { NextAuthOptions } from "next-auth";
import TodoistProvider from "next-auth/providers/todoist";

export const authOptions: NextAuthOptions = {
  providers: [
    TodoistProvider({
      clientId: process.env.TODOIST_ID || "",
      clientSecret: process.env.TODOIST_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      session.access_token = token.access_token as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token as string;
      }
      return token;
    },
  },
};
