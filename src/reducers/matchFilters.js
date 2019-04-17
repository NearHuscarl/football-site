import moment from 'moment';

const matchFiltersDefaultState = {
    competition: 'all',
	date: moment(),
};

const newsFiltersReducer = (state = matchFiltersDefaultState, action) => {
	switch (action.type) {
        case 'SET_MATCH_COMPETITION_FILTER':
            return { ...state, competition: action.competition };
		case 'SET_MATCH_DATE':
			return { ...state, date: action.date };
		default:
			return state;
	}
};

export default newsFiltersReducer;
