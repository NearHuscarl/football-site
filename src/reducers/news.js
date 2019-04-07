const newsDefaultState = {
	meta: {
		lastUpdated: 0, // 1970
		currentIndex: -1,
	},
	articles: {
		0: [], // articles
	},
	headlines: [], // List of urls which are headlines
};

const newsReducer = (state = newsDefaultState, action) => {
	switch (action.type) {
		case 'SET_NEWS':
			state = { ...state, ...action.news };
			return state;
		case 'SET_HEADLINES':
			state.headlines = action.headlines;
			return state;
		default:
			return state;
	}
};

export default newsReducer;
