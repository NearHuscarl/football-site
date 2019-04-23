import moment from 'moment';

const matchFiltersDefaultState = {
    competition: 'all',
	date: moment(),
};

const matchFiltersReducer = (state = matchFiltersDefaultState, action) => {
	switch (action.type) {
		case 'SET_MATCH_COMPETITION_FILTER':
			const { competition } = action.payload;
            return { ...state, competition };
		case 'SET_MATCH_DATE':
			const { date } = action.payload;
			return { ...state, date };
		default:
			return state;
	}
};

export default matchFiltersReducer;
