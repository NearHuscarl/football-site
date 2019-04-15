import moment from 'moment';
import { newsSources } from '../settings';

const newsFiltersDefaultState = {
    text: '',
    sources: Object.keys(newsSources),
	startDate: moment().subtract(30, 'days'),
	endDate: moment(),
};

const newsFiltersReducer = (state = newsFiltersDefaultState, action) => {
	switch (action.type) {
		case 'SET_NEWS_TEXT_FILTER':
            return { ...state, text: action.text };
        case 'SET_NEWS_SOURCES_FILTER':
            return { ...state, sources: action.sources };
		case 'SET_NEWS_START_DATE':
			return { ...state, startDate: action.startDate };
		case 'SET_NEWS_END_DATE':
            return { ...state, endDate: action.endDate };
		default:
			return state;
	}
};

export default newsFiltersReducer;
