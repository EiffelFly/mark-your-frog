"use client";

import { trpc } from "@/lib/api";
import { useCallback, useState } from "react";

export type MarkYourFrogProps = {
	accessToken: string;
};

export const MarkYourFrog = (props: MarkYourFrogProps) => {
	const { accessToken } = props;
	const [isLoading, setIsLoading] = useState(false);

	const handleAnalyse = useCallback(async () => {
		const res = await trpc.todoist.analyse.query({
			accessToken,
		});
		console.log(res);
	}, []);

	return (
		<button
			onClick={handleAnalyse}
			className="w-full rounded-lg border border-zinc-100 py-4 text-center text-2xl font-semibold text-white hover:bg-zinc-100 hover:text-zinc-800"
		>
			Mark
		</button>
	);
};
