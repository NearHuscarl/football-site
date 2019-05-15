import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import hashMultipleWords from '../utilities/hashMultipleWords';
import teamNames from '../utilities/teamNames';
import Image from './Image';
import TooltipTeam from './TooltipTeam';
import defaultArticleImage from '../../public/images/Default_Article_Image.jpg';
import wrapWordIntoComponent from '../utilities/wrapWordIntoComponent';
import { articlePropTypes } from '../utilities/footballProptypes';

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
	const { highlightedWords, article } = props;
	const hashedQuery = highlightedWords.length > 0 ? hashMultipleWords(props.highlightedWords) : undefined;
	// TODO: remove
	// const hashedQuery = hashMultipleWords('has lost');

	const title = highlightWordInContent(article.title, hashedQuery);
	const description = highlightWordInContent(article.description, hashedQuery);
	const image = article.urlToImage ? article.urlToImage : defaultArticleImage;
	const content = article.content && highlightWordInContent(article.content.replace(/\[.*\]$/, ''), hashedQuery);
	const publishedAt = moment(article.publishedAt).format('HH:mm DD/MM/YYYY');

	return (
		<div className='news-list-item'>
			<a className='news-list-item__image' href={article.url} target='_blank' rel='noreferrer noopener'>
				<Image alt='article' src={image} defaultImage={defaultArticleImage} />
			</a>
			<div className='news-list-item__text'>
				<span className='news-list-item__source'>{article.source.name}</span>
				<span className='news-list-item__date'>{publishedAt}</span>
				<h2>{title}</h2>
				<h3>{description}</h3>
				<div>{content}</div>
			</div>
		</div>
	);
}

NewsListItem.propTypes = {
	article: articlePropTypes.isRequired,
	highlightedWords: PropTypes.string,
};

NewsListItem.defaultProps = {
	highlightedWords: '',
};

export default NewsListItem;
