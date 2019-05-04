const resultsDefaultState = {
	results: [],
	cache: {},
	pending: false,
};

export const reduceFilters = (filters) => {
	const query = filters.query ? `q=${filters.query}` : '';
	const startDate = filters.startDate ? `startDate=${filters.startDate.valueOf()}` : '';
	const endDate = filters.endDate ? `endDate=${filters.endDate.valueOf()}` : '';
	const sources = filters.sources ? `sources=${filters.sources.sort().toString()}` : '';

	return `${query}|${startDate}|${endDate}|${sources}`;
}

const articleResultsReducer = (state = resultsDefaultState, action) => {
	switch (action.type) {
		case 'SEARCH_ARTICLES_PENDING':
			return { ...state, pending: true };
		case 'SEARCH_ARTICLES_COMPLETED': {
			const { filters, results } = action.payload;
			const newState = {
				...state,
				results,
				cache: {
					...state.cache,
					[reduceFilters(filters)]: results,
				},
				pending: false,
			};
			return { ...state, ...newState };
		}
		default:
			return state;
	}
}

export default articleResultsReducer;