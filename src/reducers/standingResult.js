const resultsDefaultState = {
	result: [],
	competitionId: -1,
	pending: false,
};

const standingResultReducer = (state = resultsDefaultState, action) => {
	switch (action.type) {
		case 'SEARCH_STANDING_PENDING':
			return { ...state, pending: true };
		case 'SEARCH_STANDING_COMPLETED': {
			const { result, competitionId } = action.payload;
			return {
				result,
				competitionId,
				pending: false,
			};
		}
		default:
			return state;
	}
}

export default standingResultReducer;