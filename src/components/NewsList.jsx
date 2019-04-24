import React from 'react';
import PropTypes from 'prop-types';
import NewsListItem from './NewsListItem';

class NewsList extends React.Component {
	// Render NewsListItem is expensive so we need to limit rendering time to minimal
	shouldComponentUpdate(nextProps) {
		if (this.props.articles.length !== nextProps.articles.length) {
			return true;
		}
		return false;
	}

	renderArticle = (article, highlightedWords) => (
		<NewsListItem key={article.url} {...article} highlightedWords={highlightedWords} />
	);

	renderArticles = () => {
		const { articles, highlightedWords } = this.props;
		const components = [];

		articles.forEach((article) => {
			components.push(this.renderArticle(article, highlightedWords));
		});

		return components;
	}

	renderSeeMoreButton = () => {
		const { renderSeeMoreButton, onClickSeeMoreButton } = this.props

		return (renderSeeMoreButton ?
			<button className='button button--red'
				type='button'
				onClick={onClickSeeMoreButton}>
				See more
			</button>
			:
			<p>End of list</p>
		);
	}

	render() {
		return (
			<div className='content-container'>
				<hr className='list-item-top-border' />
				{
					this.renderArticles()
				}
				<div className='see-more'>
					{
						this.renderSeeMoreButton()
					}
				</div>
			</div>
		);
	}
}

NewsList.propTypes = {
	articles: PropTypes.arrayOf(PropTypes.object).isRequired,
	onClickSeeMoreButton: PropTypes.func,
	renderSeeMoreButton: PropTypes.bool,
	highlightedWords: PropTypes.string,
};

NewsList.defaultProps = {
	onClickSeeMoreButton: null,
	renderSeeMoreButton: false,
	highlightedWords: '',
};

export default NewsList;
