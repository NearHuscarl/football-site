const setMatchCompetitionFilter = (competition) => ({
    type: 'SET_MATCH_COMPETITION_FILTER',
    competition,
});

const setMatchDate = (date) => ({
    type: 'SET_MATCH_DATE',
    date,
});

export {
    setMatchCompetitionFilter,
    setMatchDate,
};
