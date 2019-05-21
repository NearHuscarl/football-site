const playersDefaultState = {
	pending: false,
	mode: '', // top, potential, search
	models: [],
	lastDocument: null, // paginate query in case users request more
};

const playersReducer = (state = playersDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_PLAYERS_PENDING': {
			const { mode } = action.payload;
			return {
				...state,
				mode: mode || state.mode,
				pending: true
			};
		}
		case 'FETCH_PLAYERS_COMPLETED': {
			const { players, lastDocument } = action.payload;
			return {
				...state,
				models: players,
				pending: false,
				lastDocument,
			};
		}
		case 'FETCH_MORE_PLAYERS_COMPLETED': {
			const { players, lastDocument } = action.payload;
			return {
				...state,
				models: [...state.models, ...players],
				pending: false,
				lastDocument,
			};
		}
		default:
			return state;
	}
}

export default playersReducer;