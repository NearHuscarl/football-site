import moment from 'moment';
import { competitions } from '../settings';

const standingFiltersDefaultState = {
	competition: competitions.premierLeague,
	scoreType: 'TOTAL', // HOME AWAY
	// Standing 2018/19 so starting year is 2018
	year: moment().subtract(1, 'year').format('YYYY'),
};

const standingFiltersReducer = (state = standingFiltersDefaultState, action) => {
	switch (action.type) {
		case 'SET_STANDING_COMPETITION_FILTER':
			const { competition } = action.payload;
			return { ...state, competition };
		case 'SET_STANDING_YEAR':
			const { year } = action.payload;
			return { ...state, year };
		case 'SET_STANDING_SCORE_TYPE':
			const { scoreType } = action.payload;
			return { ...state, scoreType };
		default:
			return state;
	}
};

export default standingFiltersReducer;
