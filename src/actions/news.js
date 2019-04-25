import NewsAPI from 'newsapi';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import { newsSources } from '../settings';
import Log from '../utilities/log'

export const setHeadlines = (headlines) => ({
	type: 'SET_HEADLINES',
	payload: {
		headlines,
	},
});

const fetchNewsAtIndexCompleted = (articles, index) => ({
	type: 'FETCH_NEWS_AT_INDEX_COMPLETED',
	payload: {
		articles,
		index,
	},
});

export const startFetchNewsAtIndex = (index) =>
	(dispatch) => database
		.ref(`cachedData/news/data/${index}/articles`)
		.once('value')
		.then((snapshot) => {
			const articles = [];
			snapshot.forEach((childSnapshot) => {
				articles.push(childSnapshot.val());
			});
			dispatch(fetchNewsAtIndexCompleted(articles, index));
		});

export const fetchNewsPending = () => ({
	type: 'FETCH_NEWS_PENDING',
});

const fetchNewsCompleted = ({ meta, articles }) => ({
	type: 'FETCH_NEWS_COMPLETED',
	payload: {
		meta,
		articles,
	},
});

const filterOldNews = (newsList, currentIndex) => {
	const footballNewsList = newsList.filter(article => /\/(football|soccer)\b/.test(article.url));
	const oldIndexes = []; // check new source with older news and remove duplicated ones
	
	[1, 2, 3].forEach((i) => {
		if (currentIndex - i >= 0)
			oldIndexes.push(currentIndex - i);
	});

	const promises = [];
	const oldUrls = {}; // mimic C# HashSet

	oldIndexes.forEach((oldIndex) => {
		promises.push(database
			.ref(`cachedData/news/data/${oldIndex}/articles`)
			.once('value')
			.then((snapshot) => {
				snapshot.forEach((childSnapshot) => {
					const { url } = childSnapshot.val();
					oldUrls[url] = true;
				});
			})
		);
	});

	return Promise.all(promises)
		.then(() => footballNewsList.filter((news) => !oldUrls[news.url]));
}

const refreshNews = (oldIndex) => {
	let filteredNewsList = [];
	const currentIndex = oldIndex + 1;
	const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
	const sources = Object.keys(newsSources).join(',');

	Log.warning(`start getting news: sources=${sources}`);
	return newsapi.v2.topHeadlines({
		sources,
		pageSize: 100,
	})
		.then((response) => {
			updateCacheTime('news', { currentIndex });
			const newsList = response.articles;
			return filterOldNews(newsList, currentIndex);
		})
		.then((newsList) => {
			filteredNewsList = newsList;
			database
				.ref(`cachedData/news/data/${currentIndex}/totalArticles`)
				.set(filteredNewsList.length);

			const promises = [];

			filteredNewsList.forEach(article => {
				promises.push(database
					.ref(`cachedData/news/data/${currentIndex}/articles`)
					.push(article));
			});

			return Promise.all(promises);
		})
		.then(() => filteredNewsList)
		.catch((err) => {
			Log.error(`refreshNews: ${err}`);
			return filteredNewsList;
		});
}

export const startFetchNews = () =>
	(dispatch) => {
		dispatch(fetchNewsPending());

		return checkCacheTimeExpired('news')
			.then((result) => {
				const { expired, meta } = result;
				let promise = Promise.resolve(null);

				if (expired) {
					promise = refreshNews(meta.currentIndex)
						.then((articles) => ({ meta, articles }));
				} else {
					promise = database
						.ref(`cachedData/news/data/${meta.currentIndex}/articles`)
						.once('value')
						.then((snapshot) => {
							const articles = [];
							snapshot.forEach((childSnapshot) => {
								articles.push(childSnapshot.val());
							});
							return { meta, articles };
						})
				}
				return promise;
			})
			.then((result) => {
				dispatch(fetchNewsCompleted(result));
			});
	}
