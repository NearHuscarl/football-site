const setNewsTextFilter = (text = '') => ({
	type: 'SET_NEWS_TEXT_FILTER',
	text,
});

const setNewsSourcesFilter = (sources) => ({
    type: 'SET_NEWS_SOURCES_FILTER',
    sources,
});

const setNewsStartDate = (startDate) => ({
    type: 'SET_NEWS_START_DATE',
    startDate,
});

const setNewsEndDate = (endDate) => ({
    type: 'SET_NEWS_END_DATE',
    endDate,
});

export {
    setNewsTextFilter,
    setNewsSourcesFilter,
    setNewsStartDate,
    setNewsEndDate,
};
