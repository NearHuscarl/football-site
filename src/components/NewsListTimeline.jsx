import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NewsList from './NewsList';
import Loader from './Loader';
import { startFetchNewsAtIndex } from '../actions/news';
import settings from '../settings';

class NewsListTimeline extends React.Component {
	constructor(props) {
		super(props);

		this.ARTICLE_BATCH = 15
		this.state = {
			currentIndex: this.props.lastIndex,
			articleCount: this.ARTICLE_BATCH,
		};
	}

	// TODO: use react-select
	// https://redux.js.org/faq/react-redux#why-is-my-component-re-rendering-too-often
	// because getAllArticles() will trigger rerendering every time the store change
	// shouldComponentUpdate(nextProps, nextState) {
	//     if (this.state.articleCount !== nextState.articleCount) {
	//         return true;
	//     }
	//     if (this.props.articles.length != nextProps.articles.length) {
	//         return true;
	//     }
	//     return false;
	// }
	componentDidUpdate(prevProps) {
		if (this.props.lastIndex !== prevProps.lastIndex && this.state.currentIndex === -1) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				currentIndex: this.props.lastIndex,
				articleCount: this.ARTICLE_BATCH,
			}));
		}
	}

	requestMoreArticles = () => {
		const { articles } = this.props;
		const { currentIndex, articleCount } = this.state;
		const newIndex = currentIndex - 1;

		if (articleCount + this.ARTICLE_BATCH <= articles.length) {
			this.setState((state) => ({
				articleCount: state.articleCount + this.ARTICLE_BATCH,
			}));
			return Promise.resolve(0);
		}

		return this.props.startFetchNewsAtIndex(newIndex)
			.then(() => {
				this.setState((state) => ({
					currentIndex: newIndex,
					articleCount: state.articleCount + this.ARTICLE_BATCH,
				}));
			});
	}

	getRenderedArticles = () => {
		const { articles } = this.props;
		const { articleCount } = this.state;

		const renderedArticles = [];
		let lastIndex = -1;

		articles.forEach((article, index) => {
			if (index < articleCount) {
				lastIndex = index;
				renderedArticles.push(article);
			}
		});

		// store run out of articles, request more and fill the rest
		if (renderedArticles.length < articleCount) {
			this.requestMoreArticles()
				.then(() => {
					for (let i = lastIndex; i < articleCount; i+=1) {
						renderedArticles.push(articles[i]);
					}
				});
		}

		return renderedArticles;
	}

	render() {
		const { currentIndex, articleCount } = this.state;

		return (
			currentIndex !== -1 ?
				<NewsList
					articles={this.getRenderedArticles()}
					renderSeeMoreButton={(currentIndex > 0 && articleCount < settings.maxArticlesPerPage)}
					onClickSeeMoreButton={this.requestMoreArticles} />
				:
				<Loader height='40vh' />
		);
	}
}

const getAllArticles = (articleObj) => {
	const articles = [];
	const keys = Object.keys(articleObj);
	keys.reverse();

	keys.forEach((index) => {
		articleObj[index].forEach((article) => {
			articles.push(article);
		});
	});

	return articles;
}

export const MockNewsListTimeline = NewsListTimeline;

NewsListTimeline.propTypes = {
	articles: PropTypes.arrayOf(PropTypes.object).isRequired,
	lastIndex: PropTypes.number.isRequired,
	startFetchNewsAtIndex: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	articles: getAllArticles(state.news.models),
	lastIndex: state.news.meta.currentIndex,
});

const mapDispatchToProps = (dispatch) => ({
	startFetchNewsAtIndex: (index) => dispatch(startFetchNewsAtIndex(index)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewsListTimeline);
