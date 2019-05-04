import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, updateChildRef } from './util';
import Log from '../utilities/log'
import teamLogos from '../utilities/teamLogos';

export const setTeamsAtCompetition = (teams, competitionId) => ({
	type: 'SET_TEAMS_AT_COMPETITION',
	payload: {
		teams,
		competitionId,
	},
});

export const fetchTeamsPending = (competitionId) => ({
	type: 'FETCH_TEAMS_PENDING',
	payload: {
		competitionId,
	},
});

const fetchTeamsCompleted = (competitionId, teams) => ({
	type: 'FETCH_TEAMS_COMPLETED',
	payload: {
		competitionId,
		teams,
	},
});

const flattenTeamData = (team, competition) => {
	const result = team;
	
	result.competitionId = competition.id;
	result.competitionName = competition.name;
	result.areaId = team.area.id;
	result.areaName = team.area.name;

	delete result.area;
	return result;
}

const refreshTeam = (competitionId) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting teams: competitionId=${competitionId}`);
	return footballData.getTeamsFromCompetition({
		competitionId,
	}).then((data) => {
		const teamResults = {};
		const { teams } = data;

		teams.forEach((t) => {
			const team = flattenTeamData(t, data.competition)
			teamResults[team.id] = team;
			updateChildRef(database.ref('teams'), 'id', { equalTo: team.id }, team);
		});
		updateCacheTime('teams', competitionId);
		return teamResults;
	}).catch((err) => {
		Log.error(`refreshTeam: ${err}`)
	});
}

export const startFetchTeams = (competitionId) =>
	(dispatch) => {
		dispatch(fetchTeamsPending(competitionId));

		return checkCacheTime('teams', competitionId)
			.then((expired) => {
				if (expired) {
					return refreshTeam(competitionId)
				}

				return database.ref('teams')
					.orderByChild('competitionId')
					.equalTo(competitionId)
					.once('value').then((snapshot) => {
						const teams = {};
						snapshot.forEach((childSnapshot) => {
							const team = childSnapshot.val();
							teams[team.id] = team;
						});
						return teams;
					});
			})
			.then((result) => {
				const teams = result;

				// Update obsolete logo urls
				Object.keys(teams).forEach((teamId) => {
					if (has(teamLogos, teamId)) {
						teams[teamId].crestUrl = teamLogos[teamId];
					}
				});
				dispatch(fetchTeamsCompleted(competitionId, teams));
			})
	}