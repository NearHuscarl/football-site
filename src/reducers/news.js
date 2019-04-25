const newsDefaultState = {
	meta: {
		lastUpdated: 0, // 1970
		currentIndex: -1,
	},
	pending: false,
	models: {},
	headlines: [], // List of headline urls
};

const newsReducer = (state = newsDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_NEWS_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_NEWS_COMPLETED': {
			const { meta, articles } = action.payload;
			return {
				...state,
				meta,
				models: {
					...state.models,
					[meta.currentIndex]: articles,
				},
				pending: false,
			};
		}
		case 'FETCH_NEWS_AT_INDEX_COMPLETED': {
			const { index, articles } = action.payload;
			return {
				...state,
				models: {
					...state.models,
					[index]: articles
				},
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

export default newsReducer;
