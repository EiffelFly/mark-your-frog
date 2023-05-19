import { Metadata } from "next";
import { SignInButton, SignOutButton } from "@/components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="mx-auto w-auto px-4 pt-16 pb-8 sm:pt-24 lg:px-8">
        <h1 className="mx-auto text-center text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-8xl">
          Mark your Frog
        </h1>
        <SignInButton />
        <SignOutButton />
      </main>
    </div>
  );
}
