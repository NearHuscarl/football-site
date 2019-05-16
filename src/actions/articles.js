import NewsAPI from 'newsapi';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get } from './util';
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

const getId = (article) => {
	const { url } = article;
	const lastSegment = url.match(/[^/]+\/?$/)[0];
	return lastSegment.slice(0, 20);
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
		// Remove other sport articles
		const articles = response.articles.filter(article => /\/(football|soccer)\b/.test(article.url));

		articles.forEach((article) => {
			articles.push(article);
			firestore.doc(`articles/${getId(article)}`).set(article);
		});

		updateCacheTime('articles');
		return articles;
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
			})
			.then((articles) => {
				dispatch(fetchArticlesCompleted(articles))
			});
	}
