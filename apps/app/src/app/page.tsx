import { Metadata } from "next";
import { TaskList } from "./TaskList";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 pt-40">
      <div className="flex">
        <h1 className="mx-auto text-center text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-8xl">
          Mark your Frog
        </h1>
        {/* @ts-expect-error */}
        <TaskList />
      </div>
    </div>
  );
}
