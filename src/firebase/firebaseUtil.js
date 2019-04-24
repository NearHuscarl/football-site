import FootballData from 'footballdata-api-v2';
import defaultsDeep from 'lodash/defaultsDeep';
import database from './firebase';
import hashMultipleWords from '../utilities/hashMultipleWords'

const footballDataAPI = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

class FirebaseUtil {

	static checkPath = (path) => database
		.ref(path)
		.once('value')
		.then((snapshot) => !!snapshot.val());

	// common data is info about competitions, areas
	static updateCommonData = () => {
		// TODO: update again if lastUpdated is too old (apply to competitions)
		FirebaseUtil.updateAreas();
		FirebaseUtil.updateCompetitions();
	}

	static updateAreas = () => FirebaseUtil.checkPath('data/areas')
		.then((exist) => {
			if (!exist) {
				footballDataAPI.getAreas()
					.then((data) => {
						const { areas } = data;
						const areaData = {};
						areas.forEach((area) => {
							areaData[area.id] = area;
						})
						return database
							.ref('data/areas')
							.set(areaData);
					})
					.then(() => true);
			}

			return false;
		})

	static updateCompetitions = () => FirebaseUtil.checkPath('data/competitions')
		.then((exist) => {
			if (!exist) {
				footballDataAPI.getCompetitions({
					plan: 'TIER_TWO', // Get all competitions from 'TIER_TWO' and 'TIER_ONE'
				})
					.then((data) => {
						const { competitions } = data;
						const competitionData = {};
						competitions.forEach((competition) => {
							competitionData[competition.id] = competition;
						})
						return database
							.ref('data/competitions')
							.set(competitionData);
					})
					.then(() => true);
			}

			return false;
		})

	static getAllTeamNames = () => database
		.ref(`cachedData/teams`)
		.once('value')
		.then((snapshot) => {
			const teamData = snapshot.val();
			const teamNames = {
				shortName: [],
				name: [],
				dict: {
					shortName: {},
					name: {},
				},
			};

			Object.keys(teamData).forEach((competitionId) => {
				const teams = teamData[competitionId].data;

				Object.keys(teams).forEach((teamId) => {
					const id = Number(teamId);
					const team = teams[id];
					const { shortName } = team;
					const name = team.name.replace(/\s*(FC|CF|AFC)\s*/i, '');

					teamNames.shortName.push(shortName);
					teamNames.name.push(name);

					teamNames.dict.shortName[shortName] = id;
					teamNames.dict.name[name] = id;
				});
			});

			// copy(JSON.stringify(teamNames))
			return teamNames;
		})

	static getAllTeamNameHashes = () => this.getAllTeamNames().then((teamNames) => {
		// Sort: longest boi is first to later set the correct deepest level value
		// for each key in teamNameHashes. Because defaultsDeep() will not reassign object properties
		teamNames.shortName.sort((a, b) => b.length - a.length);
		teamNames.name.sort((a, b) => b.length - a.length);
		const teamNameHashes = {};

		teamNames.name.forEach((name) => {
			defaultsDeep(teamNameHashes, hashMultipleWords(name, { id: teamNames.dict.name[name] }));
		});
		teamNames.shortName.forEach((name) => {
			defaultsDeep(teamNameHashes, hashMultipleWords(name, { id: teamNames.dict.shortName[name] }));
		});

		return teamNameHashes;
	})
}

export default FirebaseUtil;