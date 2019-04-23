const newsDefaultState = {
	meta: {
		lastUpdated: 0, // 1970
		currentIndex: -1,
	},
	articles: {
		0: [], // articles
	},
	headlines: [], // List of headline urls
};

const newsReducer = (state = newsDefaultState, action) => {
	switch (action.type) {
		case 'SET_NEWS':
			const { news } = action.payload;
			state = { ...state, ...news };
			return state;
		case 'SET_NEWS_AT_INDEX':
			const { index, articles } = action.payload;
			const newState = {
				articles: { ...state.articles, [index]: articles },
			};
			return { ...state, ...newState };
		case 'SET_HEADLINES':
			const { headlines } = action.payload;
			return { ...state, headlines };
		default:
			return state;
	}
};

export default newsReducer;
