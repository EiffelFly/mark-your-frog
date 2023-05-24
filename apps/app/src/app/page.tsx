import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { MarkYourFrog } from "../components";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Mark Your Frog",
};

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<div className="mx-auto flex max-w-[800px] flex-1 flex-col pt-20">
			<div className="flex flex-col">
				<h1 className="mb-20 text-center text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-8xl">
					Mark your Frog
				</h1>
				{session && session.access_token ? (
					<MarkYourFrog accessToken={session.access_token} />
				) : null}
			</div>
		</div>
	);
}
