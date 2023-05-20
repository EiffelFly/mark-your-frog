import "../styles/globals.css";
import { NavBar } from "@/components";
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
          <div className="flex flex-col flex-1 pt-20 lg:pt-[240px] max-w-[800px] mx-auto">
            <div className="flex flex-col">
              <h1 className="mb-20 text-center text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-8xl">
                Mark your Frog
              </h1>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
