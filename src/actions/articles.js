import NewsAPI from 'newsapi';
import moment from 'moment';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, filterRef, updateChildRef } from './util';
import { newsSources } from '../settings';
import Log from '../utilities/log'

export const setHeadlines = (headlines) => ({
	type: 'SET_HEADLINES',
	payload: {
		headlines,
	},
});

export const fetchArticlesPending = () => ({
	type: 'FETCH_ARTICLES_PENDING',
});

const fetchArticlesCompleted = (articles) => ({
	type: 'FETCH_ARTICLES_COMPLETED',
	payload: {
		articles,
	},
});

export const flattenArticleData = (article) => {
	const result = article;
	
	result.sourceId = article.source.id;
	result.sourceName = article.source.name;
	
	delete result.source;
	return result;
}

// check new source with older news and remove duplicated ones
const filterArticles = (articles) => {
	// Remove other sport articles
	const footballArticles = articles.filter(article => /\/(football|soccer)\b/.test(article.url));

	return database
		.ref('articles')
		.orderByChild('publishedAt')
		.startAt(moment().subtract(3, 'days').format('YYYY-MM-DD'))
		.once('value').then((snapshot) => {
			const oldUrls = {}; // mimic C# HashSet

			snapshot.forEach((childSnapshot) => {
				const { url } = childSnapshot.val();
				oldUrls[url] = true;
			});

			return footballArticles.filter((article) => !oldUrls[article.url]);
		});
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
		articles.forEach((a) => {
			const article = flattenArticleData(a);
			database.ref('articles').push().setWithPriority(article, 0 - Date.now());

			updateChildRef(database.ref('articles'), 'url', {
				equalTo: article.url
			}, article, 0 -  moment(article.publishedAt).valueOf());
		});

		updateCacheTime('articles');
		return articles;
	});
}

export const startFetchArticlesFrom = (articleCount) =>
	(dispatch) => {
		dispatch(fetchArticlesPending());

		return database
			.ref('articles')
			.orderByPriority()
			.limitToFirst(articleCount)
			.once('value').then((snapshot) => {
				const articles = [];
				snapshot.forEach((childSnapshot) => {
					articles.push(childSnapshot.val());
				});
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

				return database
					.ref('articles')
					.orderByPriority()
					.limitToFirst(15)
					.once('value').then((snapshot) => {
						const articles = [];
						snapshot.forEach((childSnapshot) => {
							articles.push(childSnapshot.val());
						});
						return articles;
					});
			})
			.then((result) => {
				dispatch(fetchArticlesCompleted(result));
			});
	}
