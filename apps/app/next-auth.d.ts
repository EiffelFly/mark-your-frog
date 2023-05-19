import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
  }
}
