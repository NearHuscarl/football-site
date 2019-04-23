const setStandingCompetitionFilter = (competition) => ({
    type: 'SET_STANDING_COMPETITION_FILTER',
    payload: {
        competition,
    },
});

const setStandingYear = (year) => ({
    type: 'SET_STANDING_YEAR',
    payload: {
        year,
    },
});

const setStandingScoreType = (scoreType) => ({
    type: 'SET_STANDING_SCORE_TYPE',
    payload: {
        scoreType,
    },
});

export {
    setStandingCompetitionFilter,
    setStandingYear,
    setStandingScoreType,
};
