import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NewsList from './NewsList';
import Loader from './Loader';
import { startFetchArticlesFrom } from '../actions/articles';
import settings from '../settings';
import { articlePropTypes } from '../utilities/footballProptypes';

const ARTICLE_BATCH = 15;
let articleCount = ARTICLE_BATCH;

class NewsListTimeline extends React.Component {
	requestMoreArticles = () => {
		articleCount += ARTICLE_BATCH;
		return this.props.startFetchArticlesFrom(articleCount);
	}

	render() {
		const { articles } = this.props;

		return (
			articles.length > 0 ?
				<NewsList
					articles={articles}
					renderSeeMoreButton={articles.length < settings.maxArticlesPerPage}
					onClickSeeMoreButton={this.requestMoreArticles} />
				:
				<Loader height='40vh' />
		);
	}
}

export const MockNewsListTimeline = NewsListTimeline;

NewsListTimeline.propTypes = {
	articles: PropTypes.arrayOf(articlePropTypes).isRequired,
	startFetchArticlesFrom: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	articles: state.articles.models,
});

const mapDispatchToProps = (dispatch) => ({
	startFetchArticlesFrom: (count) => dispatch(startFetchArticlesFrom(count)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewsListTimeline);
