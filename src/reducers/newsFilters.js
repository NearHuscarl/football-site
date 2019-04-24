import moment from 'moment';
import { newsSources } from '../settings';

const newsFiltersDefaultState = {
	query: '',
	sources: Object.keys(newsSources),
	startDate: moment().subtract(30, 'days').format(),
	endDate: moment().format(),
};

const newsFiltersReducer = (state = newsFiltersDefaultState, action) => {
	switch (action.type) {
		case 'SET_NEWS_SEARCH_QUERY': {
			const { query } = action.payload;
			return { ...state, query };
		}
		case 'SET_NEWS_SOURCES_FILTER': {
			const { sources } = action.payload;
			return { ...state, sources };
		}
		case 'SET_NEWS_START_DATE': {
			const { startDate } = action.payload;
			return { ...state, startDate };
		}
		case 'SET_NEWS_END_DATE': {
			const { endDate } = action.payload;
			return { ...state, endDate };
		}
		default:
			return state;
	}
};

export default newsFiltersReducer;
