import { getServerSession } from "next-auth";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { getSession } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export async function TaskList() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.access_token) {
    return null;
  }

  const todoistApi = new TodoistApi(session.access_token);

  const tasks = await todoistApi.getTasks();

  console.log(tasks);

  return <div></div>;
}
