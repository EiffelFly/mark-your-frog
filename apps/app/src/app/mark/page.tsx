import { Metadata } from "next";
import { MarkYourFrog } from "./MarkYourFrog";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default async function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full  border border-white py-4 rounded-lg">
          <div className="flex flex-row gap-x-5 m-auto">
            <p className="text-white font-sans font-normal text-lg my-auto">
              Loading...
            </p>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white my-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
      }
    >
      {/* @ts-expect-error */}
      <MarkYourFrog />
    </Suspense>
  );
}
