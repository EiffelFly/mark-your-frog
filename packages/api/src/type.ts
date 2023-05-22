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
	id: z.string(),
	content: z.string(),
	description: z.string(),
	priority: z.number(),
	url: z.string(),
	due: z.object({
		date: z.string(),
		is_recurring: z.boolean(),
		datetime: z.string(),
		string: z.string(),
		timezone: z.string(),
	}),
});

export type SimplifiedTodoistTodo = z.infer<typeof simplifiedTodoistTodoSchema>;

export const todoistFrogSchema = z.object({
	frog: simplifiedTodoistTodoSchema,
	reason: z.string(),
});

export type TodoistFrog = z.infer<typeof todoistFrogSchema>;
