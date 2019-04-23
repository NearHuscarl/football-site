const matchesDefaultState = {};

const matchesReducer = (state = matchesDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_MATCH':
            const { matches } = action.payload;
            return {
                ...state,
                ...matches
            };
        default:
            return state;
    }
}

export default matchesReducer;