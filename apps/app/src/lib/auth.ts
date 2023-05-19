import { NextAuthOptions } from "next-auth";
import TodoistProvider from "next-auth/providers/todoist";

export const authOptions: NextAuthOptions = {
  providers: [
    TodoistProvider({
      clientId: process.env.TODOIST_ID || "",
      clientSecret: process.env.TODOIST_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log(token);
      return session;
    },
  },
};
