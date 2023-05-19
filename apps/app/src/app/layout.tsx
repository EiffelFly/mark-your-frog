import { NavBar } from "@/components/NavBar";
import "../styles/globals.css";
import { getServerSession } from "next-auth";
// include styles from the ui package

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className="bg-zinc-900">
      <body>
        <div className="flex flex-col min-h-screen">
          <NavBar user={session?.user || null} />
          {children}
        </div>
      </body>
    </html>
  );
}
