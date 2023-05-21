import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";

export default {
	async fetch(request: Request): Promise<Response> {
		return fetchRequestHandler({
			endpoint: "/trpc",
			req: request,
			router: appRouter,
			createContext: () => ({}),
		});
	},
};
