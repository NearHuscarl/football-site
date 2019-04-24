// Use to compare both number and string
const max = (array) => {
	if (array.length === 0) {
		return undefined;
	}

	let maxElement = array[0];
	array.forEach((element) => {
		if (element > maxElement) {
			maxElement = element;
		}
	});

	return maxElement;
}

export default max;