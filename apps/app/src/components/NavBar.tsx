"use client";

import { SignOutButton } from "./SignOutButton";
import { SignInButton } from "./SignInButton";
import { User } from "next-auth";

export type NavBarProps = {
  user: Pick<User, "email" | "image" | "name"> | null;
};

export const NavBar = (props: NavBarProps) => {
  const { user } = props;
  return (
    <div className="flex flex-row w-full p-10">
      {user ? (
        <p className="text-white font-sans text-base font-medium">
          {user.name}
        </p>
      ) : null}

      <div className="ml-auto flex">
        {user ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
};
