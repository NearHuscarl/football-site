import isEmpty from 'lodash/isEmpty';
import startUpdateStanding from './standings';
import startUpdateTopScorers from './topScorers';

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
		const { standings, topScorers } = getState();
		const competitionId = filters.competition;

		const getResults = (standingResults = {}) => {
			if (isEmpty(standingResults)) return;
			const { table } = standingResults[competitionId]
				.standings
				.find((standing) => standing.type === filters.scoreType);

			dispatch(searchStandingCompleted(table, competitionId));
			if (!topScorers[competitionId]) {
				dispatch(startUpdateTopScorers(competitionId));
			}
		}

		if (standings[competitionId]) {
			getResults(standings);
			return Promise.resolve(null);
		}

		return dispatch(startUpdateStanding(competitionId)).then(() => {
			getResults(getState().standings);
			return Promise.resolve(null);
		});
	}