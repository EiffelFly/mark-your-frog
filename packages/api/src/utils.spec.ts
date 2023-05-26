import { OpenAI } from "langchain";
import { expect, test } from "vitest";
import { chunkArrayByTokenLimit } from "./utils";

test("Should successfull chunk json", async () => {
	const model = new OpenAI({
		temperature: 0.1,
		modelName: "gpt-3.5-turbo",
		openAIApiKey: "mock-open-api-key",
	});

	const todos = Array(10).fill({
		content: "Do the dishes",
		due: {
			date: "2021-07-02",
			is_recurring: false,
			lang: "en",
			string: "today",
		},
		id: 1,
		priority: 1,
		url: "https://todoist.com/showTask?id=1",
		description: "This is a description",
	});

	const chunkTodo = await chunkArrayByTokenLimit(todos, model, 300);

	expect(chunkTodo).toStrictEqual([
		[
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
		],
		[
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
			{
				content: "Do the dishes",
				due: {
					date: "2021-07-02",
					is_recurring: false,
					lang: "en",
					string: "today",
				},
				id: 1,
				priority: 1,
				url: "https://todoist.com/showTask?id=1",
				description: "This is a description",
			},
		],
	]);
});
