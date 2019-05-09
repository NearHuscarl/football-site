const teamDefaultState = {
	pending: false,
	models: {},
};

const teamReducer = (state = teamDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_TEAM_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_TEAM_COMPLETED': {
			const { team } = action.payload;
			return {
				models: team,
				pending: false,
			};
		}
		default:
			return state;
	}
}

export default teamReducer;