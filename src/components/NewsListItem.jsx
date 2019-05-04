import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import hashMultipleWords from '../utilities/hashMultipleWords';
import teamNames from '../utilities/teamNames';
import Image from './Image';
import TooltipTeam from './TooltipTeam';
import defaultArticleImage from '../../public/images/Default_Article_Image.jpg';
import wrapWordIntoComponent from '../utilities/wrapWordIntoComponent';

const highlightWordInContent = (content, keyword) => {
	const params = [{
		component: TooltipTeam,
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
	const image = props.urlToImage ? props.urlToImage : defaultArticleImage;
	const content = props.content && highlightWordInContent(props.content.replace(/\[.*\]$/, ''), hashedQuery);
	const t1 = performance.now();
	console.log("Call took " + (t1 - t0) + " milliseconds.");

	const publishedAt = moment(props.publishedAt).format('HH:mm DD/MM/YYYY');

	return (
		<a className='news-list-item' href={props.url} target='_blank' rel='noreferrer noopener'>
			<div className='news-list-item__image'>
				<Image alt='article' src={image} defaultImage={defaultArticleImage} />
			</div>
			<div className='news-list-item__text'>
				<span className='news-list-item__source'>{props.sourceName}</span>
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
	urlToImage: PropTypes.string,
	sourceName: PropTypes.string.isRequired,
	highlightedWords: PropTypes.string,
};

NewsListItem.defaultProps = {
	highlightedWords: '',
	content: '',
	urlToImage: '',
};

export default NewsListItem;
