const setArticleSearchQuery = (query = '') => ({
	type: 'SET_ARTICLE_SEARCH_QUERY',
	payload: {
		query,
	},
});

const setArticleSourcesFilter = (sources) => ({
	type: 'SET_ARTICLE_SOURCES_FILTER',
	payload: {
		sources,
	},
});

const setArticleStartDate = (startDate) => ({
	type: 'SET_ARTICLE_START_DATE',
	payload: {
		startDate,
	},
});

const setArticleEndDate = (endDate) => ({
	type: 'SET_ARTICLE_END_DATE',
	payload: {
		endDate,
	},
});

export {
	setArticleSearchQuery,
	setArticleSourcesFilter,
	setArticleStartDate,
	setArticleEndDate,
};
