import NextAuth, { NextAuthOptions } from "next-auth";
import TodoistProvider from "next-auth/providers/todoist";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    TodoistProvider({
      clientId: process.env.TODOIST_ID || "",
      clientSecret: process.env.TODOIST_SECRET || "",
    }),
  ],
};
export default NextAuth(authOptions);
