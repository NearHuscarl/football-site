import isEmpty from 'lodash/isEmpty';
import startFetchStanding from './standings';
import startFetchTopScorers from './topScorers';

export const searchStandingPending = () => ({
	type: 'SEARCH_STANDING_PENDING',
});

const searchStandingCompleted = (result, competitionId) => ({
	type: 'SEARCH_STANDING_COMPLETED',
	payload: {
		result,
		competitionId,
	}
});

export const startSearchStanding = () =>
	(dispatch, getState) => {
		dispatch(searchStandingPending());

		const filters = getState().standingFilters;
		const standings = getState().standings.models;
		const topScorers = getState().topScorers.models;
		const competitionId = filters.competition;

		const getResults = (standingResults = {}) => {
			if (isEmpty(standingResults)) return;
			const { table } = standingResults[competitionId]
				.standings
				.find((standing) => standing.type === filters.scoreType);

			dispatch(searchStandingCompleted(table, competitionId));
			if (!topScorers[competitionId]) {
				dispatch(startFetchTopScorers(competitionId));
			}
		}

		if (standings[competitionId]) {
			getResults(standings);
			return Promise.resolve(null);
		}

		return dispatch(startFetchStanding(competitionId)).then(() => {
			getResults(getState().standings.models);
			return Promise.resolve(null);
		});
	}