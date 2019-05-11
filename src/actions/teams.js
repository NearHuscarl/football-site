import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, updateChildRef } from './util';
import footballDataToSofifaTeamId from '../utilities/footballDataToSofifaTeamId';
import Log from '../utilities/log'
import obsoleteFDTeamLogoIds from '../utilities/obsoleteFDTeamLogoIds';

const fetchTeamsPending = () => ({
	type: 'FETCH_TEAMS_PENDING',
});

const fetchTeamsCompleted = (teams) => ({
	type: 'FETCH_TEAMS_COMPLETED',
	payload: {
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

export const getTeamDetails = () =>
	fetch('https://gist.githubusercontent.com/NearHuscarl/7f171acfdbb5ad4dd74d6676c30c587f/raw/0912797187a8ae7239aa4dc83d7d20eb7e185cca/squads.json')
		.then((response) => response.json());

/**
 * Merge FootballData and sofifa team info into a single object
 * @param {object} team 
 * @param {object} teamDetails 
 */
const mergeTeamInfo = (fdTeam, sofifaTeam) => {
	const team = { ...fdTeam, ...sofifaTeam, };

	team.id = fdTeam.id; 
	team.squad = team.squad.map((player) => ({ id: player.id, role: player.role })); // trim name field before uploading to firebase

	if (has(obsoleteFDTeamLogoIds, team.id)) {
		team.crestUrl = team.logo; // use logo from sofifa instead of crestUrl from FootballData
	}
	delete team.logo;
	delete team.country; // use areaName from FootballData instead of country from sofifa
	delete team.homeStadium // use venue from FootballData instead of homeStadium from sofifa
	
	// Those properties will be deleted since there are already duplicates in team.contact.
	// Prefer to use sofifa contact info since it seems to be more up-to-dated
	delete team.address;
	delete team.email;
	delete team.founded;
	delete team.phone;
	delete team.website;

	return team;
}

const refreshTeam = (competitionIds) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);
	const promises = [];

	promises.push(getTeamDetails());
	competitionIds.forEach((competitionId) => {
		Log.warning(`start getting teams: competitionId=${competitionId}`);
		promises.push(footballData.getTeamsFromCompetition({ competitionId }));
	});

	return Promise.all(promises)
		.then((results) => {
			const [sofifaTeamResults, ...fdTeamResults] = results;
			const sofifaTeams = {};
			sofifaTeamResults.forEach((team) => {
				sofifaTeams[team.id] = team;
			});

			fdTeamResults.forEach((fdTeamResult) => {
				fdTeamResult.teams.forEach((t) => {
					const fdTeam = flattenTeamData(t, fdTeamResult.competition);
					const sofifaTeam = sofifaTeams[footballDataToSofifaTeamId[fdTeam.id]];
					const team = mergeTeamInfo(fdTeam, sofifaTeam);
					
					updateChildRef(database.ref('teams'), 'id', { equalTo: team.id }, team);
				});
			});
			updateCacheTime('teams');
		})
}

const startFetchTeams = (competitionIds) =>
	(dispatch) => {
		dispatch(fetchTeamsPending());

		return checkCacheTime('teams')
			.then((expired) => {
				if (expired) {
					refreshTeam(competitionIds); // Get team info async
				}

				return database.ref('teams').once('value').then((snapshot) => {
					const teamResults = {};

					snapshot.forEach((childSnapshot) => {
						const team = childSnapshot.val();
						const { competitionId } = team;
						
						if (!teamResults[competitionId]) teamResults[competitionId] = {};
						teamResults[competitionId][team.id] = team;
					});
					return teamResults;
				});
			})
			.then((teams) => {
				dispatch(fetchTeamsCompleted(teams));
			})
	}

export default startFetchTeams;