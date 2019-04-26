/* eslint-disable no-plusplus */
import React from 'react';
import has from 'lodash/has';

const compareHashes = (wordHashes, wordArray, startIndex = 0) => {
	let wordHashesVal = wordHashes;
	const result = {
		endIndex: -1,
		meta: {},
	};

	for (let i = startIndex; i < wordArray.length; i++) {
		const word = wordArray[i];

		if (!wordHashesVal[word]) {
			result.endIndex = -1;
			break;
		}
		if (wordHashesVal[word].leaf === true) {
			const meta = wordHashesVal[word];
			const keys = Object.keys(meta);
			result.endIndex = i;

			for (let j = 0; j < keys.length; j++) {
				if (keys[j] !== 'leaf' &&
					  (typeof meta[keys[j]] === 'boolean'
					|| typeof meta[keys[j]] === 'number'
					|| typeof meta[keys[j]] === 'string')) {
					result.meta[keys[j]] = meta[keys[j]];
				}
			}
			break;
		}
		wordHashesVal = wordHashesVal[word];
	}

	return result;
}

const nonAlphabeticRegex = /([^A-Za-z ].*)+/;
const getNoneAlphabeticPart = (str) => {
	const match = nonAlphabeticRegex.exec(str);

	if (match != null) {
		return match[0];
	}
	return '';
}

/**
 * 
 * @param {string} paragraph The input string whose keywords match param.keyword will be wrapped in param.Component
 * @param {Object} params `param[]`
 * 
 * `param`: { component: React.Component, props: object, keyword: object }
 * 
 * See `teamNames.js` to see how keyword object structures
 */
const wrapWordIntoComponent = (paragraph, params) => {
	const words = paragraph.split(' ');
	const wrappedContent = [];

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		let wrapped = false;

		for (let k = 0; k < params.length; k++) {
			const param = params[k];
			if (has(param.keyword, word)) {
				const { keyword } = param;
				const result = compareHashes(keyword, words, i);

				if (result.endIndex !== -1) {
					const gibberishSuffix = getNoneAlphabeticPart(words[result.endIndex]); // usually a trailling dot or comma
					let matchWords = '';

					for (let j = i; j <= result.endIndex; j++) {
						if (j === result.endIndex) {
							matchWords += words[j].replace(gibberishSuffix, '');
						} else {
							matchWords += words[j] + ' ';
						}
					}

					const Component = param.component;
					wrappedContent.push(<Component key={i} {...param.props} {...result.meta}>{matchWords}</Component>);
					wrappedContent.push(' ' + gibberishSuffix);
					i = result.endIndex;
					wrapped = true;
					break;
				}
			}
		}

		if (!wrapped) {
			wrappedContent.push(word + ' ');
		} else {
			wrappedContent.push(' ');
		}
	}
	return wrappedContent;
}

export default wrapWordIntoComponent;