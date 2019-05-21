import { player } from '../settings';

const playerFiltersDefaultState = {
	filterType: 'General',
	query: '',
	nationality: '',
	team: {
		id: null,
		name: null,
	},
	position: '',
	minRating: player.minRating,
	maxRating: player.maxRating,
	minPotential: player.minRating,
	maxPotential: player.maxRating,
	minAge: player.minAge,
	maxAge: player.maxAge,
	preferredFoot: '',
	reputation: -1,
	skillMoves: -1,
	weakFoot: -1,
};

const playerFiltersReducer = (state = playerFiltersDefaultState, action) => {
	switch (action.type) {
		case 'SET_PLAYER_FILTER_TYPE': {
			const { filterType } = action.payload;
			return { ...state, filterType };
		}
		case 'SET_PLAYER_SEARCH_QUERY': {
			const { query } = action.payload;
			return { ...state, query };
		}
		case 'SET_PLAYER_NATIONALITY': {
			const { nationality } = action.payload;
			return { ...state, nationality };
		}
		case 'SET_PLAYER_TEAM': {
			const { team } = action.payload;
			return { ...state, team };
		}
		case 'SET_PLAYER_POSITION': {
			const { position } = action.payload;
			return { ...state, position };
		}
		case 'SET_PLAYER_MIN_RATING': {
			const { rating } = action.payload;
			return { ...state, minRating: rating };
		}
		case 'SET_PLAYER_MAX_RATING': {
			const { rating } = action.payload;
			return { ...state, maxRating: rating };
		}
		case 'SET_PLAYER_MIN_POTENTIAL_RATING': {
			const { rating } = action.payload;
			return { ...state, minPotential: rating };
		}
		case 'SET_PLAYER_MAX_POTENTIAL_RATING': {
			const { rating } = action.payload;
			return { ...state, maxPotential: rating };
		}
		case 'SET_PLAYER_MIN_AGE': {
			const { age } = action.payload;
			return { ...state, minAge: age };
		}
		case 'SET_PLAYER_MAX_AGE': {
			const { age } = action.payload;
			return { ...state, maxAge: age };
		}
		case 'SET_PLAYER_PREFERRED_FOOT': {
			const { preferredFoot } = action.payload;
			return { ...state, preferredFoot };
		}
		case 'SET_PLAYER_REPUTATION': {
			const { reputation } = action.payload;
			return { ...state, reputation };
		}
		case 'SET_PLAYER_SKILL_MOVES': {
			const { skillMoves } = action.payload;
			return { ...state, skillMoves };
		}
		case 'SET_PLAYER_WEAK_FOOT': {
			const { weakFoot } = action.payload;
			return { ...state, weakFoot };
		}
		default:
			return state;
	}
};

export default playerFiltersReducer;
