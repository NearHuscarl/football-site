const setNewsSearchQuery = (query = '') => ({
	type: 'SET_NEWS_SEARCH_QUERY',
	payload: {
		query,
	},
});

const setNewsSourcesFilter = (sources) => ({
	type: 'SET_NEWS_SOURCES_FILTER',
	payload: {
		sources,
	},
});

const setNewsStartDate = (startDate) => ({
	type: 'SET_NEWS_START_DATE',
	payload: {
		startDate,
	},
});

const setNewsEndDate = (endDate) => ({
	type: 'SET_NEWS_END_DATE',
	payload: {
		endDate,
	},
});

export {
	setNewsSearchQuery,
	setNewsSourcesFilter,
	setNewsStartDate,
	setNewsEndDate,
};
