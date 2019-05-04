import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, filterRef, updateChildRef } from './util';
import Log from '../utilities/log'
import teamLogos from '../utilities/teamLogos';
import { standingScores } from '../settings';

const fetchStandingPending = (competitionId) => ({
	type: 'FETCH_STANDING_PENDING',
	payload: {
		competitionId,
	},
});

const fetchStandingCompleted = (competitionId, standing) => ({
	type: 'FETCH_STANDING_COMPLETED',
	payload: {
		competitionId,
		standing,
	},
});

const flattenStandingData = (standing) => {
	const result = standing;
	
	result.competitionId = standing.competition.id;
	result.competitionName = standing.competition.name;
	result.seasonId = standing.season.id;
	result.startDate = standing.season.startDate;
	result.endDate = standing.season.endDate;
	result.currentMatchday = standing.season.currentMatchday;

	standing.standings.forEach((s) => {
		const { type } = s;
		result[type.toLowerCase()] = s.table;
	});
	
	delete result.competition;
	delete result.season;
	delete result.standings;
	
	return result;
}

const refreshStanding = (competitionId) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting standing: competitionId=${competitionId}`);
	return footballData.getStandingsFromCompetition({
		competitionId,
	}).then((data) => {
		const standings = flattenStandingData(data);
		
		updateChildRef(database.ref('standings'), 'competitionId', { equalTo: competitionId }, standings)
			.then(() => updateCacheTime('standings', competitionId));
		return standings;
	}).catch((err) => {
		Log.error(`refreshStanding: ${err}`);
	});
}

const startFetchStanding = (competitionId) =>
	(dispatch) => {
		dispatch(fetchStandingPending(competitionId));

		return checkCacheTime('standings', competitionId)
			.then((expired) => {
				if (expired) {
					return refreshStanding(competitionId);
				}
				return filterRef(database.ref('standings'), 'competitionId', { equalTo: competitionId })
					.then((result) => result[0]);
			})
			.then((result) => {
				const standing = result;

				// Update obsolete logo urls
				Object.keys(standingScores).forEach((scoreType) => {
					const type = scoreType.toLowerCase();
					standing[type].forEach((rank, tableIndex) => {
						const teamId = rank.team.id;
						if (has(teamLogos, teamId)) {
							standing[type][tableIndex].team.crestUrl = teamLogos[teamId];
						}
					});
				});
				dispatch(fetchStandingCompleted(competitionId, standing));
			})
	}

export default startFetchStanding;