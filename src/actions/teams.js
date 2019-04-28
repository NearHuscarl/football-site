import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
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

const refreshTeam = (competitionId) => {
	const teamData = {};
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting teams: competitionId=${competitionId}`);
	return footballData.getTeamsFromCompetition({
		competitionId,
	})
		.then((data) => {
			updateCacheTime(`teams/${competitionId}`);

			const { teams } = data;
			teams.forEach((team) => {
				teamData[team.id] = team;
			});

			return database
				.ref(`cachedData/teams/${competitionId}/data`)
				.set(teamData);
		})
		.then(() => teamData)
		.catch((err) => {
			Log.error(`refreshTeam: ${err}`)
			return teamData;
		});
}

export const startFetchTeams = (competitionId) =>
	(dispatch) => {
		dispatch(fetchTeamsPending(competitionId));

		return checkCacheTimeExpired(`teams/${competitionId}`)
			.then((result) => {
				const { expired } = result;
				let promise = Promise.resolve(null);

				if (expired) {
					promise = refreshTeam(competitionId)
				} else {
					promise = database
						.ref(`cachedData/teams/${competitionId}/data`)
						.once('value')
						.then((snapshot) => snapshot.val());
				}
				return promise;
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