import { OpenAI } from "langchain";

export function chunkArray<T>(array: T[], chunkSize: number) {
	const chunkedArray: T[][] = [];
	let index = 0;

	while (index < array.length) {
		chunkedArray.push(array.slice(index, index + chunkSize));
		index += chunkSize;
	}

	return chunkedArray;
}

export async function chunkArrayByTokenLimit<T>(array: T[], model: OpenAI, tokenLimit: number) {
	const result: T[][] = [];
	const tokenCounts: number[] = [];
	let currentChunk: T[] = [];
	let currentChunkTokens = 0;

	// Calculate token counts for all elements
	for (const element of array) {
		const elementTokens = await model.getNumTokens(JSON.stringify(element));
		tokenCounts.push(elementTokens);
	}

	for (let i = 0; i < array.length; i++) {
		const elementTokens = tokenCounts[i];

		if (elementTokens + currentChunkTokens > tokenLimit) {
			console.log("chunking", elementTokens + currentChunkTokens);
			result.push(currentChunk);
			currentChunk = [];
			currentChunkTokens = 0;
		}

		currentChunk.push(array[i]);
		currentChunkTokens += elementTokens;
	}

	// Push the last chunk if it's not empty
	if (currentChunk.length > 0) {
		result.push(currentChunk);
	}

	return result;
}
