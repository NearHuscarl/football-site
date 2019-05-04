const articlesDefaultState = {
	pending: false,
	models: [],
	headlines: [], // List of headline urls
};

const articlesReducer = (state = articlesDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_ARTICLES_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_ARTICLES_COMPLETED': {
			const { articles } = action.payload;
			return {
				...state,
				models: articles,
				pending: false,
			};
		}
		case 'SET_HEADLINES': {
			const { headlines } = action.payload;
			return { ...state, headlines };
		}
		default:
			return state;
	}
};

export default articlesReducer;
