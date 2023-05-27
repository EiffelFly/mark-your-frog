import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default function auth(req: NextApiRequest, res: NextApiResponse) {
	// const { host } = req.headers;

	// if (!host) {
	// 	return res.status(400).send(`Bad Request, missing host header`);
	// }

	// process.env.NEXTAUTH_URL = /localhost/.test(host) ? `http://${host}` : host;
	return NextAuth(authOptions)(req, res);
}
