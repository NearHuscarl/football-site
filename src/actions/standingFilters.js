const setStandingCompetitionFilter = (competition) => ({
    type: 'SET_STANDING_COMPETITION_FILTER',
    competition,
});

const setStandingYear = (year) => ({
    type: 'SET_STANDING_YEAR',
    year,
});

const setStandingScoreType = (scoreType) => ({
    type: 'SET_STANDING_SCORE_TYPE',
    scoreType,
});

export {
    setStandingCompetitionFilter,
    setStandingYear,
    setStandingScoreType,
};
