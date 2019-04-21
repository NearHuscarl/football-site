import isEmpty from 'lodash/isEmpty';
import { startUpdateStanding } from './standings';

const searchStanding = (result) => ({
    type: 'UPDATE_STANDING_RESULT',
    result,
});

export const setSearchStandingStatus = (isSearching) => ({
    type: 'SET_SEARCH_STANDING_STATUS',
    isSearching,
});

export const startSearchStanding = () => {
    return (dispatch, getState) => {
        dispatch(setSearchStandingStatus(true));

        const filters = getState().standingFilters;
        const { standings } = getState();

        const getResults = (standings = {}) => {
            if (isEmpty(standings)) return;
            const table = standings[filters.competition]
                .standings
                .find((standing) => standing.type === filters.scoreType)
                .table;

            dispatch(searchStanding(table));
            dispatch(setSearchStandingStatus(false));
        }

        if (standings[filters.competition]) {
            getResults(standings);
            return Promise.resolve(null);
        }

        return dispatch(startUpdateStanding(filters.competition)).then(() => {
            getResults(getState().standings);
            return Promise.resolve(null);
        });
    }
}