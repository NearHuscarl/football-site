import get from 'lodash/get';

const matchesDefaultState = {
	pending: false,
	models: [],
};

const processTeam = (matchTeam, teamDetail) => {
	const result = matchTeam;
	
	result.crestUrl = get(teamDetail, 'crestUrl', '');
	result.shortName = get(teamDetail, 'shortName', matchTeam.name);
	return result;
}

/**
 * 
 * @param {object[]} matches 
 */
export const processResults = (matches, competitions) =>
	matches.map((m) => {
		const match = m;
		const { competition, homeTeam, awayTeam } = match;
		const homeTeamDetail = get(competitions, `${competition.id}.teams.${homeTeam.id}`);
		const awayTeamDetail = get(competitions, `${competition.id}.teams.${awayTeam.id}`);

		match.homeTeam = processTeam(match.homeTeam, homeTeamDetail);
		match.awayTeam = processTeam(match.awayTeam, awayTeamDetail);
		return match;
	}) 

const matchesReducer = (state = matchesDefaultState, action) => {
	switch (action.type) {
		case 'FETCH_MATCHES_PENDING': {
			return { ...state, pending: true };
		}
		case 'FETCH_MATCHES_COMPLETED': {
			const { matches, competitions } = action.payload;
			return {
				models: processResults(matches, competitions),
				pending: false,
			};
		}
		default:
			return state;
	}
}

export default matchesReducer;