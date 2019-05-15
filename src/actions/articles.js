import NewsAPI from 'newsapi';
import moment from 'moment';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, update, get } from './util';
import { newsSources } from '../settings';
import Log from '../utilities/log'

export const setHeadlines = (headlines) => ({
	type: 'SET_HEADLINES',
	payload: {
		headlines,
	},
});

const fetchArticlesPending = () => ({
	type: 'FETCH_ARTICLES_PENDING',
});

const fetchArticlesCompleted = (articles) => ({
	type: 'FETCH_ARTICLES_COMPLETED',
	payload: {
		articles,
	},
});

// check new source with older news and remove duplicated ones
const filterArticles = (articles) => {
	// Remove other sport articles
	const footballArticles = articles.filter(article => /\/(football|soccer)\b/.test(article.url));
	const startDate = moment().subtract(3, 'days').format('YYYY-MM-DD');
	const oldUrls = {}; // mimic C# HashSet
	const addOldUrls = (article) => {
		oldUrls[article.url] = true;
	}

	return get(firestore
		.collection('articles')
		.where('publishedAt', '>=', startDate), addOldUrls)
		.then(() => footballArticles.filter((article) => !oldUrls[article.url]));
}

const refreshArticle = () => {
	const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
	const sources = Object.keys(newsSources).join(',');

	Log.warning(`start getting news: sources=${sources}`);
	return newsapi.v2.topHeadlines({
		sources,
		pageSize: 100,
		// eslint-disable-next-line arrow-body-style
	}).then((response) => {
		return filterArticles(response.articles);
	}).then((articles) => {
		const articleResults = [];

		articles.forEach((article) => {
			articleResults.push(article);
			update(firestore
				.collection('articles')
				.where('url', '==', article.url), article);
		});

		updateCacheTime('articles');
		return articleResults;
	});
}

export const startFetchArticlesFrom = (articleCount) =>
	(dispatch) => {
		dispatch(fetchArticlesPending());

		return get(firestore
			.collection('articles')
			.orderBy('publishedAt', 'desc')
			.limit(articleCount))
			.then((articles) => {
				dispatch(fetchArticlesCompleted(articles))
			});
	}

export const startFetchArticles = () =>
	(dispatch) => {
		dispatch(fetchArticlesPending());

		return checkCacheTime('articles')
			.then((expired) => {
				if (expired) {
					return refreshArticle();
				}

				return get(firestore
					.collection('articles')
					.orderBy('publishedAt', 'desc')
					.limit(15))
					.then((articles) => {
						dispatch(fetchArticlesCompleted(articles))
					});
			})
	}
