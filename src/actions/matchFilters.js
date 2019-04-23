const setMatchCompetitionFilter = (competition) => ({
    type: 'SET_MATCH_COMPETITION_FILTER',
    payload: {
        competition,
    },
});

const setMatchDate = (date) => ({
    type: 'SET_MATCH_DATE',
    payload: {
        date,
    },
});

export {
    setMatchCompetitionFilter,
    setMatchDate,
};
