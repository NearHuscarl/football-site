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

        if (standings[filters.competition]) {
            const table = standings[filters.competition]
                .standings
                .find((standing) => standing.type === filters.scoreType)
                .table;

            dispatch(searchStanding(table));
            dispatch(setSearchStandingStatus(false));
            return Promise.resolve(null);
        }
        dispatch(setSearchStandingStatus(false));
    }
}