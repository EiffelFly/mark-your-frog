import { getServerSession } from "next-auth";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { authOptions } from "@/lib/auth";
import { ToDo } from "type";
import { OpenAI } from "langchain/llms/openai";
import { JsonSpec } from "langchain/tools";
import { JsonToolkit, createJsonAgent } from "langchain/agents";

export async function MarkYourFrog() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.access_token) {
    return null;
  }

  const todoistApi = new TodoistApi(session.access_token);

  const tasks = await todoistApi.getTasks();

  const todos: ToDo[] = tasks
    .filter((task) => task.isCompleted === false)
    .map((e) => ({
      id: e.id,
      content: e.content,
      priority: e.priority,
      due: e.due || null,
      description: e.description,
      url: e.url,
    }));

  const input = `### You are a smart and powerful assistant, 
  
  and you need to help me find the most important task that I need to finish from the list. 
  
  In order to make the answer precise, let's think step by step, but you don't need to include your
  
  reasoning in the answer. But try to fill in the below format ###
  
  Desired format: {
    todo: the data of todo
    reason: the reason why you think this is the most important task in 100 words
  }`;

  const toolkit = new JsonToolkit(
    new JsonSpec(JSON.parse(JSON.stringify(todos)))
  );
  const model = new OpenAI({
    temperature: 0.1,
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
  });

  console.log(`Executing with input "${input}"...`);

  const executor = createJsonAgent(model, toolkit);

  const result = await executor.call({ input });

  return <div>{result.output}</div>;
}
