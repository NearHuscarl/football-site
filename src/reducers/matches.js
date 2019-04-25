const matchesDefaultState = {
	pending: false,
	models: {},
};

const matchesReducer = (state = matchesDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_MATCHES_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_MATCHES_COMPLETED': {
			const { matches } = action.payload;
			return {
				models: {
					...state.models,
					...matches
				},
				pending: false,
			};
		}
		case 'SET_MATCHES': {
			const { matches } = action.payload;
			return {
				models: {
					...state.models,
					...matches,
				},
				pending: state.pending,
			};
		}
		default:
			return state;
	}
}

export default matchesReducer;