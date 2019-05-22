import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import invert from 'lodash/invert';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime } from './util';
import { getPlayerDetails } from './players';
import footballDataToSofifaTeamId from '../utilities/footballDataToSofifaTeamId';
import obsoleteFDTeamLogoIds from '../utilities/obsoleteFDTeamLogoIds';
import { competitionIds as competitionIdSet } from '../settings';
import Log from '../utilities/log'

export const getTeamDetails = () =>
	fetch('https://gist.githubusercontent.com/NearHuscarl/7f171acfdbb5ad4dd74d6676c30c587f/raw/ac0d86e1d66c4c25c49d123764d0121c9e9667a3/squads.json')
		.then((response) => response.json());

/**
 * Merge FootballData and sofifa team info into a single object
 * @param {object} team 
 * @param {object} teamDetails 
 * @param {object} playerDict 
 */
const mergeTeamInfo = (fdTeam, sofifaTeam, fdTeamDict) => {
	const team = { ...fdTeam, ...sofifaTeam, };

	team.id = fdTeam.id; 
	team.rivalTeam.id = Number(fdTeamDict[sofifaTeam.rivalTeam.id]) || -1;
	team.founded = sofifaTeam.contact.founded; // TODO: move founded field to root in library

	if (has(obsoleteFDTeamLogoIds, team.id)) {
		team.crestUrl = team.logo; // use logo from sofifa instead of crestUrl from FootballData
	}

	delete team.contact.founded;
	delete team.logo;
	delete team.country; // use area.name from FootballData instead of country from sofifa
	delete team.homeStadium // use venue from FootballData instead of homeStadium from sofifa
	
	// These properties will be deleted since there are already duplicates in team.contact.
	// Prefer to use sofifa contact info since it seems to be more up-to-dated
	delete team.address;
	delete team.email;
	delete team.phone;
	delete team.website;
	delete team.squad; // squad is a seperate collection

	return team;
}

/**
 * 
 * @param {object} fdTeam 
 * @param {{
 * 	squad: object[]
 * }} sofifaTeam 
 * @param {*} playerDict 
 */
const getSquad = (fdTeam, sofifaTeam, playerDict) =>
	sofifaTeam.squad.map((player) => {
		const result = playerDict[player.id];
		result.role = player.role;
		result.team.id = fdTeam.id;
		return result;
	});

const refreshTeam = (competitionIds) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);
	const promises = [];

	promises.push(getPlayerDetails());
	promises.push(getTeamDetails());
	competitionIds.forEach((competitionId) => {
		Log.warning(`start getting teams: competitionId=${competitionId}`);
		promises.push(footballData.getTeamsFromCompetition({ competitionId }));
	});
	
	const toHashSet = (array) => {
		const hashSet = {};
		array.forEach((item) => {
			hashSet[item.id] = item;
		});
		return hashSet;
	}

	return Promise.all(promises).then(async (results) => {
		const [players, sofifaTeams, ...fdTeamResults] = results;
		const sofifaTeamDict = toHashSet(sofifaTeams);
		const playerDict = toHashSet(players);
		const fdTeamDict = invert(footballDataToSofifaTeamId);

		await fdTeamResults.reduce((prev, fdTeamResult) =>
			prev.then(async () => {
				const teamBatch = firestore.batch();
				const { competition } = fdTeamResult;
				const competitionRef = firestore.doc(`competitions/${competition.id}`)

				fdTeamResult.teams.forEach((t) => {
					const fdTeam = t;
					fdTeam.competition = { id: competition.id, name: competition.name };
					const sofifaTeam = sofifaTeamDict[footballDataToSofifaTeamId[fdTeam.id]];
					const team = mergeTeamInfo(fdTeam, sofifaTeam, fdTeamDict);
					const squad = getSquad(fdTeam, sofifaTeam, playerDict);
					const teamRef = firestore.doc(`teams/${team.id}`)

					teamBatch.set(teamRef, { ...team, squad }, { merge: true });
					teamBatch.set(competitionRef, { teams: { [team.id]: team } }, { merge: true });
				});

				await teamBatch.commit().then(() => {
					Log.debug(`batch update ${competition.name}'s teams`)
				});
			}), Promise.resolve());
		Log.debug('update teams completed');
		updateCacheTime('teams');
	});
}

const checkUpdateTeams = (force = false, competitionIds = Object.values(competitionIdSet)) =>
	checkCacheTime('teams')
		.then((expired) => {
			if (force || expired) {
				return refreshTeam(competitionIds);
			}
			return Promise.resolve();
		});

export default checkUpdateTeams;