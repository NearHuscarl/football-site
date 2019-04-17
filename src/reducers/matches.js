const matchesDefaultState = {};

const matchesReducer = (state = matchesDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_MATCH':
            return {
                ...state,
                ...action.matches
            };
        default:
            return state;
    }
}

export default matchesReducer;