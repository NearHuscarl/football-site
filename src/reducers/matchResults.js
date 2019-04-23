const resultsDefaultState = {
    results: [],
    pending: false,
};

const matchResultsReducer = (state = resultsDefaultState, action) => {
    switch (action.type) {
        case 'SEARCH_MATCHES_PENDING':
            return { ...state, pending: true };
        case 'SEARCH_MATCHES_COMPLETED':
            const { results } = action.payload;
            return {
                ...state,
                results,
                pending: false,
            };
        default:
            return state;
    }
}

export default matchResultsReducer;