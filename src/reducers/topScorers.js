const topScorersDefaultState = {
	pending: false,
	models: {},
};

const topScorersReducer = (state = topScorersDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_TOP_SCORERS_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_TOP_SCORERS_COMPLETED': {
			const { competitionId, scorers } = action.payload;
			return {
				models: {
					...state.models,
					[competitionId]: scorers,
				},
				pending: false,
			};
		}
		default:
			return state;
	}
}

export default topScorersReducer;