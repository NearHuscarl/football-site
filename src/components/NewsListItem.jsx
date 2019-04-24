/* eslint-disable no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import has from 'lodash/has';
import hashMultipleWords from '../utilities/hashMultipleWords';
import teamNames from '../utilities/teamNames';
import Tooltip from './Tooltip';

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

const highlightWordInContent = (content, keyword) => {
	const params = [{
		component: Tooltip,
		props: { className: 'hint-text' },
		keyword: teamNames,
	}];

	if (keyword) {
		params.push({
			component: 'span',
			props: { className: 'search-result' },
			keyword,
		});
	}
	return wrapWordIntoComponent(content, params);
};

const NewsListItem = (props) => {
	const { highlightedWords } = props;
	const hashedQuery = highlightedWords.length > 0 ? hashMultipleWords(props.highlightedWords) : undefined;
	// TODO: remove
	// const hashedQuery = hashMultipleWords('has lost');

	const t0 = performance.now();
	const title = highlightWordInContent(props.title, hashedQuery);
	const description = highlightWordInContent(props.description, hashedQuery);
	const content = props.content && highlightWordInContent(props.content.replace(/\[.*\]$/, ''), hashedQuery);
	const t1 = performance.now();
	console.log("Call took " + (t1 - t0) + " milliseconds.");

	const publishedAt = moment(props.publishedAt).format('HH:mm DD/MM/YYYY');

	return (
		<a className='news-list-item' href={props.url} target='_blank' rel='noreferrer noopener'>
			<div className='news-list-item__image'>
				<img alt='article' src={props.urlToImage} />
			</div>
			<div className='news-list-item__text'>
				<span className='news-list-item__source'>{props.source.name}</span>
				<span className='news-list-item__date'>{publishedAt}</span>
				<h2>{title}</h2>
				<h3>{description}</h3>
				<div>{content}</div>
			</div>
		</a>
	);
}

NewsListItem.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	content: PropTypes.string,
	publishedAt: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	urlToImage: PropTypes.string.isRequired,
	source: PropTypes.shape({
		name: PropTypes.string,
	}).isRequired,
	highlightedWords: PropTypes.string,
};

NewsListItem.defaultProps = {
	highlightedWords: '',
	content: '',
};

export default NewsListItem;
