import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "@mark-your-frog/api";

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/trpc`,
			// fetch(url, options) {
			// 	return fetch(url, {
			// 		...options,
			// 		// credentials: "include",
			// 	});
			// },
		}),
	],
});
