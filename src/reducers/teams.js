const teamsDefaultState = {
	pending: {
		pendingCompetitions: [],
		getTeamsPending: false,
	},
	models: {},
};

const teamsReducer = (state = teamsDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_TEAMS_PENDING': {
			const { competitionId } = action.payload;
			return {
				...state,
				pending: {
					pendingCompetitions: state.pending.pendingCompetitions.concat(competitionId),
					getTeamsPending: true,
				}
			};
		}
		case 'FETCH_TEAMS_COMPLETED': {
			const { competitionId, teams } = action.payload;
			const pendingCompetitions = state.pending.pendingCompetitions
				.filter((pendingCompetitionId) => pendingCompetitionId !== competitionId);

			return {
				models: {
					...state.models,
					[competitionId]: teams,
				},
				pending: {
					pendingCompetitions,
					getTeamsPending: (pendingCompetitions.length > 0),
				},
			};
		}
		case 'SET_TEAMS_AT_COMPETITION': {
			const { teams, competitionId } = action.payload;
			return {
				pending: state.pending,
				models: {
					...state.models,
					[competitionId]: teams,
				}
			};
		}
		default:
			return state;
	}
}

export default teamsReducer;