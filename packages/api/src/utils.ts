export function chunkArray<T>(array: T[], chunkSize: number) {
	const chunkedArray: T[][] = [];
	let index = 0;

	while (index < array.length) {
		chunkedArray.push(array.slice(index, index + chunkSize));
		index += chunkSize;
	}

	return chunkedArray;
}
