"use client";

import { trpc } from "@/lib/api";
import { TodoistFrog } from "@mark-your-frog/api";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Nullable } from "type";

export type MarkYourFrogProps = {
	accessToken: string;
};

export const MarkYourFrog = (props: MarkYourFrogProps) => {
	const { accessToken } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [frog, setFrog] = useState<Nullable<TodoistFrog>>(null);

	const handleAnalyse = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await trpc.todoist.analyse.query({
				accessToken,
			});

			setIsLoading(false);
			setFrog(res);
		} catch (err) {
			console.log(err);
			setIsLoading(false);
		}
	}, [accessToken]);

	return (
		<div className="flex flex-col gap-y-12">
			{isLoading ? (
				<div className="flex w-full rounded-lg border border-white py-4">
					<div className="m-auto flex flex-row gap-x-5">
						<p className="my-auto font-sans text-lg font-normal text-white">Loading...</p>
						<svg
							className="my-auto -ml-1 mr-3 h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				</div>
			) : (
				<button
					onClick={handleAnalyse}
					className="w-full rounded-lg border border-zinc-100 py-4 text-center text-2xl font-semibold text-white hover:bg-zinc-100 hover:text-zinc-800"
				>
					Mark
				</button>
			)}
			{frog ? (
				<div className="flex flex-col">
					<h2 className="mb-8 font-sans text-4xl font-extrabold uppercase tracking-tight text-zinc-300">
						Your frog
					</h2>
					<Link
						href={frog.frog.url}
						className="group mb-8 flex flex-row rounded-lg border border-zinc-300 px-8 py-4 hover:bg-zinc-300"
					>
						<div className="flex flex-col">
							<p className="font-sans text-2xl font-semibold text-zinc-300 group-hover:text-zinc-800">
								{frog.frog.content}
							</p>
							{frog.frog.due ? (
								<p className="font-sans text-xl font-semibold text-zinc-400 group-hover:text-zinc-800">
									{`DUE: ${frog.frog.due.date}`}
								</p>
							) : null}
						</div>
						<svg
							className="my-auto ml-auto fill-zinc-300 group-hover:fill-zinc-900 "
							xmlns="http://www.w3.org/2000/svg"
							width="36"
							height="36"
							viewBox="0 0 16 16"
						>
							<path
								fill-rule="evenodd"
								d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
							/>
						</svg>
					</Link>
					<div className="rounded-lg border border-zinc-300 px-8 py-4">
						<p className="text-lg font-normal text-zinc-200">{frog.reason}</p>
					</div>
				</div>
			) : null}
		</div>
	);
};
