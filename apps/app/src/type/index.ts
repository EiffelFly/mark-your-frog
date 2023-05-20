import { Task } from "@doist/todoist-api-typescript";

export type ToDo = {
  id: string;
  content: string;
  description: string;
  priority: number;
  due: Task["due"];
  url: string;
};

export type Frog = {
  todo: ToDo;
  reason: string;
};
