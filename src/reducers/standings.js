const standingsDefaultState = {
	pending: {
		pendingCompetitions: [],
		getStandingsPending: false,
	},
	models: {},
};

const standingsReducer = (state = standingsDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_STANDING_PENDING': {
			const { competitionId } = action.payload;
			return {
				...state,
				pending: {
					pendingCompetitions: state.pending.pendingCompetitions.concat(competitionId),
					getStandingsPending: true,
				}
			};
		}
		case 'FETCH_STANDING_COMPLETED': {
			const { competitionId, standing } = action.payload;
			const pendingCompetitions = state.pending.pendingCompetitions
				.filter((pendingCompetitionId) => pendingCompetitionId !== competitionId);

			return {
				models: {
					...state.models,
					[competitionId]: standing
				},
				pending: {
					pendingCompetitions,
					getStandingsPending: (pendingCompetitions.length > 0),
				},
			};
		}
		default:
			return state;
	}
}

export default standingsReducer;