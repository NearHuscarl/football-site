const resultsDefaultState = {
    results: [],
    cache: {},
};

export const reduceFilters = (filters) => {
    const text = filters.text ? `q=${filters.text}` : '';
    const startDate = filters.startDate ? `startDate=${filters.startDate.valueOf()}` : '';
    const endDate = filters.endDate ? `endDate=${filters.endDate.valueOf()}` : '';
    const sources = filters.sources ? `sources=${filters.sources.sort().toString()}` : '';

    return `${text}|${startDate}|${endDate}|${sources}`;
}

const newsResultsReducer = (state = resultsDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_NEWS_RESULTS':
            const { filters, results } = action;
            const newState = {
                results,
                cache: {
                    ...state.cache,
                    [reduceFilters(filters)]: results,
                },
            };
            return { ...state, ...newState };
        default:
            return state;
    }
}

export default newsResultsReducer;