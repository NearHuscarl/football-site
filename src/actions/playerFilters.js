const setPlayerFilterType = (filterType) => ({
	type: 'SET_PLAYER_FILTER_TYPE',
	payload: {
		filterType,
	},
});

const setPlayerSearchQuery = (query = '') => ({
	type: 'SET_PLAYER_SEARCH_QUERY',
	payload: {
		query,
	},
});

const setPlayerNationality = (nationality) => ({
	type: 'SET_PLAYER_NATIONALITY',
	payload: {
		nationality,
	},
});

const setPlayerTeam = (team) => ({
	type: 'SET_PLAYER_TEAM',
	payload: {
		team,
	},
});

const setPlayerPosition = (position) => ({
	type: 'SET_PLAYER_POSITION',
	payload: {
		position,
	},
});

const setPlayerMinRating = (rating) => ({
	type: 'SET_PLAYER_MIN_RATING',
	payload: {
		rating,
	},
});

const setPlayerMaxRating = (rating) => ({
	type: 'SET_PLAYER_MAX_RATING',
	payload: {
		rating,
	},
});

const setPlayerMinPotentialRating = (rating) => ({
	type: 'SET_PLAYER_MIN_POTENTIAL_RATING',
	payload: {
		rating,
	},
});

const setPlayerMaxPotentialRating = (rating) => ({
	type: 'SET_PLAYER_MAX_POTENTIAL_RATING',
	payload: {
		rating,
	},
});

const setPlayerMinAge = (age) => ({
	type: 'SET_PLAYER_MIN_AGE',
	payload: {
		age,
	},
});

const setPlayerMaxAge = (age) => ({
	type: 'SET_PLAYER_MAX_AGE',
	payload: {
		age,
	},
});

const setPlayerPreferredFoot = (preferredFoot) => ({
	type: 'SET_PLAYER_PREFERRED_FOOT',
	payload: {
		preferredFoot,
	},
});

const setPlayerReputation = (reputation) => ({
	type: 'SET_PLAYER_REPUTATION',
	payload: {
		reputation,
	},
});

const setPlayerSkillMoves = (skillMoves) => ({
	type: 'SET_PLAYER_SKILL_MOVES',
	payload: {
		skillMoves,
	},
});

const setPlayerWeakFoot = (weakFoot) => ({
	type: 'SET_PLAYER_WEAK_FOOT',
	payload: {
		weakFoot,
	},
});

export {
	setPlayerFilterType,
	setPlayerSearchQuery,
	setPlayerNationality,
	setPlayerTeam,
	setPlayerPosition,
	setPlayerMinRating,
	setPlayerMaxRating,
	setPlayerMinPotentialRating,
	setPlayerMaxPotentialRating,
	setPlayerMinAge,
	setPlayerMaxAge,
	setPlayerPreferredFoot,
	setPlayerReputation,
	setPlayerSkillMoves,
	setPlayerWeakFoot,
};
