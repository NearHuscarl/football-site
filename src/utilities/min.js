// Use to compare both number and string
const min = (array) => {
	if (array.length === 0) {
		return undefined;
	}

	let minElement = array[0];
	array.forEach((element) => {
		if (element < minElement) {
			minElement = element;
		}
	});

	return minElement;
}

export default min;