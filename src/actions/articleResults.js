import NewsAPI from 'newsapi';
import { reduceFilters } from '../reducers/articleResults';
import { flattenArticleData } from './articles'
import Log from '../utilities/log';

const searchArticlePending = () => ({
	type: 'SEARCH_ARTICLES_PENDING',
});

const searchArticleCompleted = (filters, results) => ({
	type: 'SEARCH_ARTICLES_COMPLETED',
	payload: {
		filters,
		results,
	},
});

const startSearchArticles = () =>
	(dispatch, getState) => {
		dispatch(searchArticlePending());

		const filters = getState().articleFilters;
		const { articleResults } = getState();
		const cacheResults = articleResults.cache[reduceFilters(filters)];

		if (cacheResults) {
			dispatch(searchArticleCompleted(filters, cacheResults));
			return Promise.resolve();
		}

		Log.warning('start searching for news');
		const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
		// setTimeout(() => {
		//     dispatch(searchArticleCompleted(filters, shuffle(mockArticles)));
		//     return Promise.resolve();
		// }, 2000);

		const q = filters.query;
		const from = filters.startDate;
		const to = filters.endDate;
		const sources = filters.sources.toString();

		Log.warning(`start getting news from search: q=${q} from=${from} to=${to} sources=${sources}`);
		return newsapi.v2.everything({
			q,
			from,
			to,
			sources,
			pageSize: 100,
		}).then((response) => {
			const results = response.articles.map((article) => flattenArticleData(article));
			dispatch(searchArticleCompleted(filters, results));
		})
	}

export default startSearchArticles;