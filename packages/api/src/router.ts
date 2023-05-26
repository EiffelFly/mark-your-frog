import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createContext } from "./worker";
import { SimplifiedTodoistTodo, TodoistFrog, TodoistTodo, todoistFrogSchema } from "./type";
import { StructuredOutputParser } from "langchain/output_parsers";

import { chunkArrayByTokenLimit } from "./utils";
import { LLMChain, OpenAI, PromptTemplate } from "langchain";
import { zodObjectTemplate } from "./prompt";

const t = initTRPC.context<typeof createContext>().create();
const publicProcedure = t.procedure;
const router = t.router;

const todoistRouter = router({
	hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		return `hello ${input ?? "world"}`;
	}),
	analyse: publicProcedure
		.input(
			z.object({
				accessToken: z.string(),
			})
		)
		.output(todoistFrogSchema)
		.query(async ({ input, ctx }) => {
			try {
				// fetch todoist api and use the filter=created before: -14 days
				const fetchTasksRes = await fetch(`https://api.todoist.com/rest/v2/tasks`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${input.accessToken}`,
					},
				});

				const todoistTasks = (await fetchTasksRes.json()) as TodoistTodo[];

				const todos: SimplifiedTodoistTodo[] = todoistTasks
					.filter((task) => task.is_completed === false)
					.map((e) => ({
						id: e.id,
						content: e.content,
						priority: e.priority,
						due: e.due || null,
						description: e.description,
						url: e.url,
					}));

				// Initialize tiktoken
				// await init((imports) => WebAssembly.instantiate(wasm, imports));
				// const encoder = new Tiktoken(cl100k.bpe_ranks, cl100k.special_tokens, cl100k.pat_str);

				// const encoding = new Tiktoken(cl100k.bpe_ranks, cl100k.special_tokens, cl100k.pat_str);

				const model = new OpenAI({
					temperature: 0.1,
					modelName: "gpt-3.5-turbo",
					openAIApiKey: ctx.OPEN_API_KEY,
				});

				const totalTodoSize = await model.getNumTokens(JSON.stringify(todos));
				let saintTodos: SimplifiedTodoistTodo[][] = [];

				if (totalTodoSize < 2048) {
					saintTodos = [[...todos]];
				} else {
					saintTodos = await chunkArrayByTokenLimit(todos, model, 3072);
				}

				const desiredStructureParser = StructuredOutputParser.fromZodSchema(todoistFrogSchema);

				const prompt = new PromptTemplate({
					template: zodObjectTemplate,
					inputVariables: ["todos"],
					partialVariables: {
						format_instructions: desiredStructureParser.getFormatInstructions(),
					},
				});

				const chain = new LLMChain({ llm: model, prompt });

				let stepResult: TodoistFrog | null = null;

				// Begin to generation analyse
				for (let i = 0; i < saintTodos.length; i++) {
					let _todoChunk = stepResult ? saintTodos[i].push(stepResult.frog) : saintTodos[i];
					const res = await chain.call({ todos: JSON.stringify(_todoChunk) });
					stepResult = JSON.parse(res.text) as TodoistFrog;
				}

				if (!stepResult) {
					throw new Error("Something went wrong when processing the frog");
				}

				return Promise.resolve(stepResult);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		}),
});

export const appRouter = router({
	todoist: todoistRouter,
});

export type AppRouter = typeof appRouter;
