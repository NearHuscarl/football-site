// Name - ID mappings
export const competitionIds = {
	bundesliga: 2002,
	premierLeague: 2021,
	championship: 2016,
	primeraDivision: 2014, // LaLiga
	serieA: 2019,
	ligue1: 2015,
	eredivisie: 2003, // Netherlands
	primeiraLiga: 2017, // Portugal
	championLeague: 2001,
}

export const player = {
	minAge: 15,
	maxAge: 45,
	minRating: 0,
	maxRating: 100,
}

export const competitionInfo = {
	[competitionIds.premierLeague]: {
		championLeagueRanks: [1, 4], // Top 4 have a place in CL next season
		// There are 2 EL places. But one place is reserved for the team that win FA Cup, if the FA winner
		// also finished in the top five places, then this place reverts to the team that finished sixth.
		eroupeLeagueRanks: 5,
		relegationRanks: [18, 20],
	},
	[competitionIds.primeraDivision]: {
		championLeagueRanks: [1, 4],
		eroupeLeagueRanks: [5, 6],
		relegationRanks: [18, 20],
	},
	[competitionIds.bundesliga]: {
		championLeagueRanks: [1, 4],
		eroupeLeagueRanks: [5, 6],
		relegationRanks: [16, 18],
	},
	[competitionIds.serieA]: {
		championLeagueRanks: [1, 4],
		eroupeLeagueRanks: [5, 6],
		relegationRanks: [18, 20],
	},
	[competitionIds.ligue1]: {
		championLeagueRanks: [1, 2],
		eroupeLeagueRanks: [3, 4],
		relegationRanks: [18, 20],
	},
	[competitionIds.championship]: {
		relegationRanks: [22, 24],
	},
	[competitionIds.eredivisie]: {
		championLeagueRanks: [1, 2],
		eroupeLeagueRanks: [3, 7],
		relegationRanks: [16, 18],
	},
	[competitionIds.primeiraLiga]: {
		championLeagueRanks: [1, 2],
		eroupeLeagueRanks: [3, 4],
		relegationRanks: [16, 18],
	},
}

export const competitions = {
	[competitionIds.premierLeague]: 'Premier League',
	[competitionIds.primeraDivision]: 'La Liga',
	[competitionIds.bundesliga]: 'Bundesliga',
	[competitionIds.serieA]: 'Serie A',
	[competitionIds.ligue1]: 'Ligue 1',
	[competitionIds.championship]: 'Championship',
	[competitionIds.eredivisie]: 'Eredivisie',
	[competitionIds.primeiraLiga]: 'Primeira Liga',
	[competitionIds.championLeague]: 'Champions League',
}

// http://www.football-data.org/documentation/quickstart#filtering
export const standingScores = {
	'HOME': 'Home',
	'AWAY': 'Away',
	'TOTAL': 'Total',
}

export const standingYears = {
	'2018': '2018/19',
	'2017': '2017/18',
	'2016': '2016/17',
	'2015': '2015/16',
	'2014': '2014/15',
	'2013': '2013/14',
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
		articles: 24, // hours
		matches: 0.75,
		players: 24 * 30,
		standings: 1,
		topScorers: 24,
		teams: 24 * 15,
		competitions: 24, // matchday update
		default: 2, // safe net
	},
};

export default settings;