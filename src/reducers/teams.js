const teamsDefaultState = {};

const teamsReducer = (state = teamsDefaultState, action) => {
    switch (action.type) {
        case 'UPDATE_TEAMS':
            const { competitionId, teams } = action.payload;
            return { ...state, [competitionId]: teams };
        case 'UPDATE_SPECIFIC_TEAM':
        {
            const { competitionId, team } = action.payload;
            const newState = { ...state };
            newState[competitionId][team.id] = team;
            return newState;
        }
        default:
            return state;
    }
}

export default teamsReducer;