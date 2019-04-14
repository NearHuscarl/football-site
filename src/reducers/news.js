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
			state = { ...state, ...action.news };
			return state;
		case 'SET_NEWS_AT_INDEX':
			const { index, articles } = action;
			let newState = {
				articles: { ...state.articles, [index]: articles },
			};
			return { ...state, ...newState };
		case 'SET_HEADLINES':
			return { ...state, headlines: action.headlines };
		default:
			return state;
	}
};

export default newsReducer;
