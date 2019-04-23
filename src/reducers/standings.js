const standingsDefaultState = {
    0: {
    }
};

const standingsReducer = (state = standingsDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_STANDING':
            const { competitionId, standing } = action.payload;
            return { ...state, [competitionId]: standing };
        default:
            return state;
    }
}

export default standingsReducer;