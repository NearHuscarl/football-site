import isEmpty from 'lodash/isEmpty';
import { startUpdateStanding } from './standings';
import { startUpdateTopScorers } from './topScorers';

const searchStanding = (result, competitionId) => ({
    type: 'UPDATE_STANDING_RESULT',
    result,
    competitionId,
});

export const setSearchStandingStatus = (isSearching) => ({
    type: 'SET_SEARCH_STANDING_STATUS',
    isSearching,
});

export const startSearchStanding = () => {
    return (dispatch, getState) => {
        dispatch(setSearchStandingStatus(true));

        const filters = getState().standingFilters;
        const { standings, topScorers } = getState();
        const competitionId = filters.competition;

        const getResults = (standings = {}) => {
            if (isEmpty(standings)) return;
            const table = standings[competitionId]
                .standings
                .find((standing) => standing.type === filters.scoreType)
                .table;

            dispatch(searchStanding(table, competitionId));
            dispatch(setSearchStandingStatus(false));
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
}