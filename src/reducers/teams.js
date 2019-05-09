const teamsDefaultState = {
	pending: false,
	models: {},
};

const teamsReducer = (state = teamsDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_TEAMS_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_TEAMS_COMPLETED': {
			const { teams } = action.payload;
			return { models: teams, pending: false };
		}
		default:
			return state;
	}
}

export default teamsReducer;