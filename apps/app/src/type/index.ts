export type ToDo = {
  id: string;
  content: string;
  description: string;
  priority: number;
  due: {
    date: string;
  } | null;
  url: string;
};
