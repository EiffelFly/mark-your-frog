import { TodoistFrog } from "./type";

export const mockFrog: TodoistFrog = {
	frog: {
		id: "1",
		content: "content",
		description: "description",
		priority: 1,
		due: {
			date: "date",
			is_recurring: false,
			datetime: "datetime",
			string: "string",
			timezone: "timezone",
		},
		url: "url",
	},
	reason: "reason",
};
