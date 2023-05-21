import "../styles/globals.css";
import { NavBar } from "@/components";
import { getServerSession } from "next-auth";
// include styles from the ui package

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession();

	return (
		<html lang="en" className="bg-zinc-900">
			<body>
				<div className="flex min-h-screen flex-col">
					<NavBar user={session?.user || null} />
					{children}
				</div>
			</body>
		</html>
	);
}
