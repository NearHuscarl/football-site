// Name - ID mappings
export const tierOneCommpetitions = {
    bundesliga: 2002,
    premierLeague: 2021,
    primeraDivision: 2014, // LaLiga
    serieA: 2019,
    ligue1: 2015,
    eredivisie: 2003, // Netherlands
    primeiraLiga: 2017, // Portugal
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
        fixtures: 1.5,
        standings: 1,
        teams: 24 * 5,
        default: 2, // safe net
    },
};

export default settings;