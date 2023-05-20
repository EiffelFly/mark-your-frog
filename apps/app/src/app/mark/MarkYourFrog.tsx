import { getServerSession } from "next-auth";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { authOptions } from "@/lib/auth";
import { Frog, ToDo } from "type";
import { LLMChain, PromptTemplate } from "langchain";
import { OpenAI } from "langchain/llms/openai";
import Link from "next/link";

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

	const template = `### You are a smart and powerful assistant, 
  
  and you need to help me find the most important task that I need to finish from the list. 
  
  In order to make the answer precise, let's think step by step, but you don't need to include your
  
  reasoning in the answer. But try to fill in the below format ###
  
  Desired format should be similar to this, you put the choosen todo into todo key: {{
    todo: {{
      "id": 6894440006,
      "content": "hello world",
      "priority": 1,
      "due": {{
        "date": "2021-10-10",
        "string": "5月21日",
        "lang": "tw",
        "isRecurring": false
      }},
      "description": "",
      "url": "https://todoist.com/showTask?id=6894440006"
    }},
    "reason": "the reason why you think this is the most important task in 100 words"
  }}
  
  INPUT: {todos}`;

	const prompt = new PromptTemplate({
		template,
		inputVariables: ["todos"],
	});

	const model = new OpenAI({ temperature: 0.1, modelName: "gpt-3.5-turbo" });
	const chain = new LLMChain({ llm: model, prompt });

	const res = await chain.call({ todos: JSON.stringify(todos) });

	const frog = JSON.parse(res.text) as Frog;

	return (
		<div className="flex flex-col">
			<h2 className="mb-8 font-sans text-4xl font-extrabold uppercase tracking-tight text-zinc-300">
				Your frog
			</h2>
			<Link
				href={frog.todo.url}
				className="group mb-8 flex flex-row rounded-lg border border-zinc-300 px-8 py-4 hover:bg-zinc-300"
			>
				<div className="flex flex-col">
					<p className="font-sans text-2xl font-semibold text-zinc-300 group-hover:text-zinc-800">
						{frog.todo.content}
					</p>
					{frog.todo.due ? (
						<p className="font-sans text-xl font-semibold text-zinc-400 group-hover:text-zinc-800">
							{`DUE: ${frog.todo.due.date}`}
						</p>
					) : null}
				</div>
				<svg
					className="my-auto ml-auto fill-zinc-300 group-hover:fill-zinc-900 "
					xmlns="http://www.w3.org/2000/svg"
					width="36"
					height="36"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707l-4.096 4.096z"
					/>
				</svg>
			</Link>
			<div className="rounded-lg border border-zinc-300 px-8 py-4">
				<p className="text-lg font-normal text-zinc-200">{frog.reason}</p>
			</div>
		</div>
	);
}
