const competitionsDefaultState = {
	pending: false,
	models: {},
};

const competitionsReducer = (state = competitionsDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_COMPETITIONS_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_COMPETITIONS_COMPLETED': {
			const { competitions } = action.payload;
			return {
				models: competitions,
				pending: false,
			};
		}
		default:
			return state;
	}
}

export default competitionsReducer;