import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { createContext } from "./worker";
import { SimplifiedTodoistTodo, TodoistFrog, TodoistTodo, todoistFrogSchema } from "./type";
import { StructuredOutputParser } from "langchain/output_parsers";

import { chunkArray } from "./utils";
import { LLMChain, OpenAI, PromptTemplate } from "langchain";

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

				const todoChunks = chunkArray(todos, 10);
				// const initialChunkCounts = todoChunks.length;
				// let saintTodoChunks: SimplifiedTodoistTodo[][] = [];

				// for (let i = 0; i < todoChunks.length; i++) {
				// 	let chunkExceedsLimit = true;

				// 	while (chunkExceedsLimit) {
				// 		const chunkToken = encoder.encode(JSON.stringify(todoChunks[i]));
				// 		if (chunkToken.length < 2048) {
				// 			chunkExceedsLimit = false;
				// 			saintTodoChunks.push(todoChunks[i]);
				// 			break;
				// 		} else {
				// 			const popedTodo = todoChunks[i].pop();
				// 			if (popedTodo) {
				// 				if (todoChunks.length === initialChunkCounts + 1) {
				// 					todoChunks.push([popedTodo]);
				// 				} else {
				// 					todoChunks[todoChunks.length - 1].push(popedTodo);
				// 				}
				// 			}
				// 		}
				// 	}
				// }

				// encoder.free();

				// console.log(saintTodoChunks);

				// encoder.free();

				// console.log(todos);

				const zodObjectTemplate = `### You are a smart and powerful assistant,

				and you need to help me find the most important task that I need to finish from the list.

				In order to make the answer precise, let's think step by step, but you don't need to include your

				reasoning in the answer. But try to fill in the below format ###

				Desired format {format_instructions}

				The reason of this chosen task should be concise and logical, it should be 100 words or less.

				INPUT: {todos}`;

				const desiredStructureParser = StructuredOutputParser.fromZodSchema(todoistFrogSchema);

				const prompt = new PromptTemplate({
					template: zodObjectTemplate,
					inputVariables: ["todos"],
					partialVariables: {
						format_instructions: desiredStructureParser.getFormatInstructions(),
					},
				});

				const model = new OpenAI({
					temperature: 0.1,
					modelName: "gpt-3.5-turbo",
					openAIApiKey: ctx.OPEN_API_KEY,
				});
				const chain = new LLMChain({ llm: model, prompt });

				let stepResult: TodoistFrog | null = null;

				// // Begin to generation analyse
				for (let i = 0; i < todoChunks.length; i++) {
					let _todoChunk = stepResult ? todoChunks[i].push(stepResult.frog) : todoChunks[i];
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
