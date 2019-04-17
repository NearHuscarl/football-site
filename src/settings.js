// Name - ID mappings
export const competitions = {
    bundesliga: 2002,
    premierLeague: 2021,
    championship: 2016,
    primeraDivision: 2014, // LaLiga
    serieA: 2019,
    ligue1: 2015,
    eredivisie: 2003, // Netherlands
    primeiraLiga: 2017, // Portugal
}

export const competitionNames = {
    [competitions.premierLeague]: 'Premier League',
    [competitions.primeraDivision]: 'La Liga',
    [competitions.bundesliga]: 'Bundesliga',
    [competitions.serieA]: 'Serie A',
    [competitions.ligue1]: 'Ligue 1',
    [competitions.championship]: 'Championship',
    [competitions.eredivisie]: 'Eredivisie',
    [competitions.primeiraLiga]: 'Primeira Liga',
}

// https://newsapi.org/sources
export const newsSources = {
    'bbc-sport': 'BBC Sport',
    'talksport': 'TalkSport',
    'the-sport-bible': 'The Sport Bible',
    'fox-sports': 'Fox Sports',
};

const settings = {
    maxArticlesPerPage: 300,
    cacheTime: {
        news: 24, // hours
        matches: 0.75,
        standings: 1,
        teams: 24 * 15,
        default: 2, // safe net
    },
};

export default settings;