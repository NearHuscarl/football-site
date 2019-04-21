const resultsDefaultState = {
    result: [],
    isSearching: false,
};

const standingResultReducer = (state = resultsDefaultState, action) => {
    switch (action.type) {
        case 'SET_SEARCH_STANDING_STATUS':
            const { isSearching } = action;
            return {
                ...state,
                isSearching,
            };
        case 'UPDATE_STANDING_RESULT':
            const { result } = action;
            return {
                ...state,
                result,
            };
        default:
            return state;
    }
}

export default standingResultReducer;