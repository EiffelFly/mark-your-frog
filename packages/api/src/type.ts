import { z } from "zod";

export const TodoistTodoSchema = z.object({
	creator_id: z.string(),
	created_at: z.string(),
	assignee_id: z.string(),
	assigner_id: z.string(),
	comment_count: z.number(),
	is_completed: z.boolean(),
	content: z.string(),
	description: z.string(),
	due: z.object({
		date: z.string(),
		is_recurring: z.boolean(),
		datetime: z.string(),
		string: z.string(),
		timezone: z.string(),
	}),
	id: z.string(),
	labels: z.array(z.string()),
	order: z.number(),
	priority: z.number(),
	project_id: z.string(),
	section_id: z.string(),
	parent_id: z.string(),
	url: z.string(),
});

export type TodoistTodo = z.infer<typeof TodoistTodoSchema>;

export const simplifiedTodoistTodoSchema = z.object({
	id: z.string().describe("The id of the todoist todo"),
	content: z.string().describe("The content of the todoist todo"),
	description: z.string().describe("The description of the todoist todo"),
	priority: z.number().describe("The priority of the todoist todo"),
	url: z.string().describe("The url of the todoist todo"),
	due: z
		.object({
			date: z.string().describe("The due date of the todoist todo like 2023-05-20"),
			string: z.string().describe("The due date of the todoist todo like 5月21日"),
			datetime: z.string().describe("The due date of the todoist todo like tw"),
			is_recurring: z.boolean().describe("Whether this is the recurring task or not"),
			timezone: z.string().describe("The timezone of the todoist todo"),
		})
		.describe("The due date object of the todoist todo"),
});

export type SimplifiedTodoistTodo = z.infer<typeof simplifiedTodoistTodoSchema>;

export const todoistFrogSchema = z.object({
	frog: simplifiedTodoistTodoSchema,
	reason: z
		.string()
		.describe("The reason why you think this is the most important task in 200 words"),
});

export type TodoistFrog = z.infer<typeof todoistFrogSchema>;
