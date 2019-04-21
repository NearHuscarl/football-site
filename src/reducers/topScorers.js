const topScorersDefaultState = {};

const topScorersReducer = (state = topScorersDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_TOP_SCORERS':
            const { competitionId, scorers } = action;
            return { ...state, [competitionId]: scorers };
        default:
            return state;
    }
}

export default topScorersReducer;