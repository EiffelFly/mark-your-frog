"use client";

import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  return (
    <button className="text-white hover:underline" onClick={() => signOut()}>
      Sign out
    </button>
  );
};
