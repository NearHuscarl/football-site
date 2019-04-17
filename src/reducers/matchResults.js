const resultsDefaultState = {
    results: [],
    isSearching: false,
};

const fixtureResultsReducer = (state = resultsDefaultState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_MATCH_STATUS':
            const { isSearching } = action;
            return {
                ...state,
                isSearching,
            };
        case 'UPDATE_MATCH_RESULTS':
            const { results } = action;
            return {
                ...state,
                results,
            };
        default:
            return state;
    }
}

export default fixtureResultsReducer;