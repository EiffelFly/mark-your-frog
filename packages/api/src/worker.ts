import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";

const corsHeader = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
	"Access-Control-Allow-Headers": "authorization,content-type",
};

export function createContext(OPEN_API_KEY: string) {
	return {
		OPEN_API_KEY,
	};
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: corsHeader,
			});
		}

		return fetchRequestHandler({
			endpoint: "/trpc",
			req: request,
			router: appRouter,
			createContext: () => createContext(env.OPENAI_API_KEY),
			responseMeta() {
				return {
					headers: corsHeader,
				};
			},
		});
	},
};
