import { Metadata } from "next";
import { MarkYourFrog } from "./MarkYourFrog";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default async function Home() {
  return (
    <Suspense fallback={"Loading..."}>
      {/* @ts-expect-error */}
      <MarkYourFrog />
    </Suspense>
  );
}
