import { processResults } from './matches';

const resultsDefaultState = {
	results: [],
	pending: false,
};

const matchResultsReducer = (state = resultsDefaultState, action) => {
	switch (action.type) {
		case 'SEARCH_MATCHES_PENDING':
			return { ...state, pending: true };
		case 'SEARCH_MATCHES_COMPLETED': {
			const { results, competitions } = action.payload;
			return {
				results: processResults(results, competitions),
				pending: false
			};
		}
		default:
			return state;
	}
}

export default matchResultsReducer;