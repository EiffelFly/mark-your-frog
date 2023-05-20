"use client";
import Link from "next/link";

export const MarkYourFrogButton = () => {
  return (
    <Link
      href="/mark"
      prefetch={false}
      className="w-full text-2xl font-semibold text-center text-white py-4 border border-zinc-100 rounded-lg hover:bg-zinc-100 hover:text-zinc-800"
    >
      Mark
    </Link>
  );
};
