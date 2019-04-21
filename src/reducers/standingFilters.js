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
            return { ...state, competition: action.competition };
		case 'SET_STANDING_YEAR':
            return { ...state, year: action.year };
        case 'SET_STANDING_SCORE_TYPE':
			return { ...state, scoreType: action.scoreType };
		default:
			return state;
	}
};

export default standingFiltersReducer;
