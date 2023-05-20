import { Metadata } from "next";
import { MarkYourFrogButton } from "@/components";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default async function Home() {
  return <MarkYourFrogButton />;
}
