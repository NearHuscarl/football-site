import PropTypes from 'prop-types';

const nameProptypes = PropTypes.shape({
	id: PropTypes.number,
	name: PropTypes.string,
});

export const articlePropTypes = PropTypes.shape({
	title: PropTypes.string,
	description: PropTypes.string,
	content: PropTypes.string,
	publishedAt: PropTypes.string,
	url: PropTypes.string,
	urlToImage: PropTypes.string,
	source: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
	}),
});

export const matchPropTypes = PropTypes.shape({
	id: PropTypes.number,
	competition: nameProptypes,
	homeTeam: nameProptypes,
	awayTeam: nameProptypes,
	status: PropTypes.string,
	utcDate: PropTypes.string,
	score: PropTypes.shape({
		fullTime: PropTypes.object,
	}),
});

export const playerPropTypes = PropTypes.shape({
	age: PropTypes.number,
	avatar: PropTypes.string,
	birthday: PropTypes.string,
	country: PropTypes.string,
	countryFlag: PropTypes.string,
	height: PropTypes.string,
	id: PropTypes.number,
	name: PropTypes.string,
	overallRating: PropTypes.number,
	potential: PropTypes.number,
	position: PropTypes.arrayOf(PropTypes.string),
	shortName: PropTypes.string,
	stats: PropTypes.shape({
		bodyType: PropTypes.string,
		internationalReputation: PropTypes.number,
		preferredFoot: PropTypes.string,
		releaseClause: PropTypes.string,
		skillMoves: PropTypes.number,
		weakFoot: PropTypes.number,
		workRate: PropTypes.string,
	}),
	value: PropTypes.string,
	wage: PropTypes.string,
	weight: PropTypes.string,
	team: PropTypes.shape({
		name: PropTypes.string,
		position: PropTypes.arrayOf(PropTypes.string),
		rating: PropTypes.number,
		shirtNumber: PropTypes.number,
		joinDate: PropTypes.string,
		contractEndDate: PropTypes.string,
	}),
	nationalteam: PropTypes.shape({
		name: PropTypes.string,
		position: PropTypes.arrayOf(PropTypes.string),
		rating: PropTypes.number,
		shirtNumber: PropTypes.number,
	}),
});

export const rankPropTypes = PropTypes.shape({
	position: PropTypes.number,
	playedGames: PropTypes.number,
	won: PropTypes.number,
	draw: PropTypes.number,
	lost: PropTypes.number,
	goalsFor: PropTypes.number,
	goalsAgainst: PropTypes.number,
	goalDifference: PropTypes.number,
	points: PropTypes.number,
	team: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		crestUrl: PropTypes.string,
	}),
});

export const standingPropTypes = PropTypes.shape({
	standings: PropTypes.shape({
		home: PropTypes.arrayOf(rankPropTypes),
		away: PropTypes.arrayOf(rankPropTypes),
		total: PropTypes.arrayOf(rankPropTypes),
	})
});

export const teamKitPropTypes = PropTypes.shape({
	home: PropTypes.string,
	away: PropTypes.string,
	third: PropTypes.string,
	goalkeeper: PropTypes.string,
});

export const teamPropTypes = PropTypes.shape({
	id: PropTypes.number,
	name: PropTypes.string,
	shortName: PropTypes.string,
	crestUrl: PropTypes.string,
	area: nameProptypes,
	countryFlag: PropTypes.string,
	competition: nameProptypes,
	rivalTeam: PropTypes.string,
	clubColors: PropTypes.string,
	tla: PropTypes.string,
	venue: PropTypes.string,
	overall: PropTypes.number,
	attack: PropTypes.number,
	midfield: PropTypes.number,
	defence: PropTypes.number,
	transferBudget: PropTypes.string,
	domesticPrestige: PropTypes.number,
	internationalPrestige: PropTypes.number,
	founded: PropTypes.string,
	kit: teamKitPropTypes,
	squad: PropTypes.arrayOf(playerPropTypes),
	contact: PropTypes.shape({
		address: PropTypes.string,
		email: PropTypes.string,
		phone: PropTypes.string,
		fax: PropTypes.string,
		website: PropTypes.string,
	}),
});

export const teamModelPropTypes = PropTypes.objectOf(
	PropTypes.objectOf(teamPropTypes),
);

export const scorerPropTypes = PropTypes.shape({
	numberOfGoals: PropTypes.number,
	player: PropTypes.shape({
		name: PropTypes.string,
		position: PropTypes.string,
	}),
	team: PropTypes.shape({
		name: PropTypes.string,
	}),
});

export const topScorerPropTypes = PropTypes.shape({
	scorers: PropTypes.arrayOf(scorerPropTypes),
});