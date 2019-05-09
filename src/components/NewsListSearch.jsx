import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import take from 'lodash/take';
import NewsList from './NewsList';
import Loader from './Loader';
import settings from '../settings';

class NewsListSearch extends React.Component {
	constructor(props) {
		super(props);
		this.ARTICLE_BATCH = 15;
		this.state = {
			articleCount: this.ARTICLE_BATCH,
		};
		// const { search } = this.props.location;
	}

	requestMoreResults = () => {
		this.setState((state) => ({
			articleCount: state.articleCount + this.ARTICLE_BATCH,
		}));
	}

	renderArticles = () => {
		const { articleCount } = this.state;
		const { articles, query } = this.props;

		return (
			articles.length > 0 ?
				<NewsList
					highlightedWords={query}
					articles={take(articles, articleCount)}
					renderSeeMoreButton={articleCount < articles.length && articleCount < settings.maxArticlesPerPage}
					onClickSeeMoreButton={this.requestMoreResults} />
				:
				<Redirect to="/news" />
		);
	}

	render() {
		const { searchPending } = this.props;

		return (searchPending ?
			<Loader height='40vh' />
			:
			this.renderArticles()
		);
	}
}

export const MockNewsListSearch = NewsListSearch;

NewsListSearch.propTypes = {
	articles: PropTypes.arrayOf(PropTypes.object).isRequired,
	query: PropTypes.string.isRequired,
	searchPending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	articles: state.articleResults.results,
	query: state.articleFilters.query,
	searchPending: state.articleResults.pending,
});

export default connect(
	mapStateToProps,
	undefined,
)(NewsListSearch);
