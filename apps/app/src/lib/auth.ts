import { NextAuthOptions } from "next-auth";
import TodoistProvider from "next-auth/providers/todoist";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";

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
	session: { strategy: "jwt" },
	callbacks: {
		async session({ session, token }) {
			session.access_token = token.access_token as string;
			return session;
		},
		async jwt({ token, account }) {
			if (account && account.access_token) {
				token.access_token = account.access_token;
			}
			return token;
		},
	},
	adapter: FirestoreAdapter({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
		}),
	}),
};
