"use client";

import { signIn } from "next-auth/react";

export const SignInButton = () => {
  return (
    <button
      className="text-white hover:underline"
      onClick={() => signIn("todoist")}
    >
      Sign In
    </button>
  );
};
