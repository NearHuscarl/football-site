const setFixtureCompetitionFilter = (competition) => ({
    type: 'SET_FIXTURE_COMPETITION_FILTER',
    competition,
});

const setFixtureDate = (date) => ({
    type: 'SET_FIXTURE_DATE',
    date,
});

export {
    setFixtureCompetitionFilter,
    setFixtureDate,
};
