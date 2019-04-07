const standingsDefaultState = {
    0: {
    }
};

const standingsReducer = (state = standingsDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_STANDING':
            const { competitionId, standing } = action;
            state[competitionId] = standing;
            return state;
        default:
            return state;
    }
}

export default standingsReducer;