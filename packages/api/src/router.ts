import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import { LLMChain, PromptTemplate } from "langchain";
import { OpenAI } from "langchain/llms/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createContext } from "./worker";

const t = initTRPC.context<typeof createContext>().create();

const publicProcedure = t.procedure;
const router = t.router;
export type ToDo = {
	id: string;
	content: string;
	description: string;
	priority: number;
	due: Task["due"];
	url: string;
};

const TodoistDue: z.ZodType<Task["due"]> = z.any();

const todoistTodoSchema = z.object({
	id: z.string(),
	content: z.string(),
	description: z.string(),
	priority: z.number(),
	url: z.string(),
	due: TodoistDue,
});

export type TodoistTodo = z.infer<typeof todoistTodoSchema>;

const todoistFrogSchema = z.object({
	frog: todoistTodoSchema,
	reason: z.string(),
});

export type TodoistFrog = z.infer<typeof todoistFrogSchema>;

const todoistRouter = router({
	hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
		console.log(ctx.OPEN_API_KEY);
		return `hello ${input ?? "world"}`;
	}),
	analyse: publicProcedure
		.input(
			z.object({
				accessToken: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const todoistApi = new TodoistApi(input.accessToken);

			const tasks = await todoistApi.getTasks({
				filter: "created before: -14 days",
			});

			const todos: TodoistTodo[] = tasks
				.filter((task) => task.isCompleted === false)
				.map((e) => ({
					id: e.id,
					content: e.content,
					priority: e.priority,
					due: e.due || null,
					description: e.description,
					url: e.url,
				}));

			const zodObjectTemplate = `### You are a smart and powerful assistant, 
  
      and you need to help me find the most important task that I need to finish from the list. 
      
      In order to make the answer precise, let's think step by step, but you don't need to include your
      
      reasoning in the answer. But try to fill in the below format ###
      
      Desired format {format_instructions}
    
      The reason of this chosen task should be concise and logical, it should be 100 words or less.
      
      INPUT: {todos}`;

			const desiredStructureParser = StructuredOutputParser.fromZodSchema(
				z.object({
					todo: z.object({
						id: z.number().nullable().describe("The id of the todoist todo"),
						content: z.string().describe("The content of the todoist todo"),
						priority: z.number().describe("The priority of the todoist todo"),
						due: z
							.object({
								date: z.string().describe("The due date of the todoist todo like 2023-05-20"),
								string: z.string().describe("The due date of the todoist todo like 5月21日"),
								lang: z.string().describe("The due date of the todoist todo like tw"),
								isRecurring: z.boolean().describe("Whether this is the recurring task or not"),
							})
							.describe("The due date object of the todoist todo"),
						description: z.string().describe("The description of the todoist todo"),
						url: z.string().describe("The url of the todoist todo"),
					}),
					reason: z
						.string()
						.describe("The reason why you think this is the most important task in 200 words"),
				})
			);

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
			const res = await chain.call({ todos: JSON.stringify(todos) });
			const frog = JSON.parse(res.text) as TodoistFrog;

			return frog;
		}),
});

export const appRouter = router({
	todoist: todoistRouter,
});

export type AppRouter = typeof appRouter;
