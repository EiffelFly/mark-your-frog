import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { LLMChain, PromptTemplate } from "langchain";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createContext } from "./worker";
import { SimplifiedTodoistTodo, TodoistFrog, TodoistTodo, todoistFrogSchema } from "./type";

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

				console.log(todos);

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

				// Begin to generation analyse
				const res = await chain.call({ todos: JSON.stringify(todos) });
				const frog = JSON.parse(res.text) as TodoistFrog;

				return Promise.resolve(frog);
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
