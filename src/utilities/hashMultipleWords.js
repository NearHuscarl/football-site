/**
 * Usage:
 *
 * ```ts
 * hashMultipleWords('this')
 * // output: { 'this': { 'leaf': true } }
 * hashMultipleWords('this is a sentence')
 * // output: { 'this': { 'is': { 'a': { 'sentence': { 'leaf': true } } } } }
 * hashMultipleWords('this is', { id: 1000 })
 * // output: { 'this': { 'is': { 'leaf': true, id: 1000 } } }
 * ```
 * @param keywords Multiple words seperated by whitespaces in string
 */
const hashMultipleWords = (keywords, info) => {
	const wordHashes = {};
	let wordHashesVal = wordHashes;
	const words = keywords.split(' ');

	words.forEach((word, index) => {
		if (index === words.length - 1) {
			wordHashesVal[word] = {
				leaf: true,
				...info,
			};
		} else {
			wordHashesVal[word] = {};
		}
		wordHashesVal = wordHashesVal[word];
	});

	return wordHashes;
}

export default hashMultipleWords;