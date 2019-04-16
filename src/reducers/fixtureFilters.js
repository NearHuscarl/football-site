import moment from 'moment';

const fixtureFiltersDefaultState = {
    competition: 'all',
	date: moment(),
};

const newsFiltersReducer = (state = fixtureFiltersDefaultState, action) => {
	switch (action.type) {
        case 'SET_FIXTURE_COMPETITION_FILTER':
            return { ...state, competition: action.competition };
		case 'SET_FIXTURE_DATE':
			return { ...state, date: action.date };
		default:
			return state;
	}
};

export default newsFiltersReducer;
