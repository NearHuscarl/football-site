const teamsDefaultState = {};

const teamsReducer = (state = teamsDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_TEAM':
            const { competitionId, teams } = action;
            return { ...state, [competitionId]: teams };
        default:
            return state;
    }
}

export default teamsReducer;