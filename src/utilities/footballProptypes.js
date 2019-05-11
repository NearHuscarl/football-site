import PropTypes from 'prop-types';

export const articlePropTypes = PropTypes.shape({
	title: PropTypes.string,
	description: PropTypes.string,
	content: PropTypes.string,
	publishedAt: PropTypes.string,
	url: PropTypes.string,
	urlToImage: PropTypes.string,
	sourceName: PropTypes.string,
});

export const matchPropTypes = PropTypes.shape({
	id: PropTypes.number,
	competitionId: PropTypes.number,
	homeTeamId: PropTypes.number,
	awayTeamId: PropTypes.number,
	status: PropTypes.string,
	utcDate: PropTypes.string,
	score: PropTypes.shape({
		fullTime: PropTypes.object,
	}),
});

export const playerPropTypes = PropTypes.shape({
	avatar: PropTypes.string,
	age: PropTypes.number,
	shortName: PropTypes.string,
	countryFlag: PropTypes.string,
	internationalReputation: PropTypes.number,
	teamPosition: PropTypes.string,
	overallRating: PropTypes.number,
	potential: PropTypes.number,
	value: PropTypes.string,
	wage: PropTypes.string,
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
	total: PropTypes.arrayOf(rankPropTypes),
});

export const teamPropTypes = PropTypes.shape({
	id: PropTypes.number,
	name: PropTypes.string,
	shortName: PropTypes.string,
	crestUrl: PropTypes.string,
});

export const teamKitPropTypes = PropTypes.shape({
	home: PropTypes.string,
	away: PropTypes.string,
	third: PropTypes.string,
	goalkeeper: PropTypes.string,
});

export const teamDetailPropTypes = PropTypes.shape({
	id: PropTypes.number,
	name: PropTypes.string,
	shortName: PropTypes.string,
	crestUrl: PropTypes.string,
	areaName: PropTypes.string,
	countryFlag: PropTypes.string,
	competitionName: PropTypes.string,
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
	kit: teamKitPropTypes,
	squad: PropTypes.shape({
		starting: PropTypes.arrayOf(playerPropTypes),
		sub: PropTypes.arrayOf(playerPropTypes),
		res: PropTypes.arrayOf(playerPropTypes),
		onLoan: PropTypes.arrayOf(playerPropTypes),
	}),
	contact: PropTypes.shape({
		address: PropTypes.string,
		email: PropTypes.string,
		phone: PropTypes.string,
		fax: PropTypes.string,
		website: PropTypes.string,
		founded: PropTypes.string,
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