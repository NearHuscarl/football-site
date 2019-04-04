export const newsDefaultState = {
	meta: {
		lastUpdated: 0, // 1970
		currentIndex: -1,
	},
	articles: [],
};

const newsReducer = (state = newsDefaultState, action) => {
	switch (action.type) {
        case 'SET_NEWS':
			return action.news;
		default:
			return state;
	}
};

export default newsReducer;
