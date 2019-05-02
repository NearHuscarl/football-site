import defaultsDeep from 'lodash/defaultsDeep';
import has from 'lodash/has';
import moment from 'moment';
import database from './firebase';
import hashMultipleWords from '../utilities/hashMultipleWords'
import trimTeamName from '../utilities/trimTeamName';

class FirebaseUtil {

	static checkPath = (path) => database
		.ref(path)
		.once('value')
		.then((snapshot) => !!snapshot.val());

	static logMatches = (startDate, endDate) => {
		let start = startDate;
		let end = endDate;
		if (!startDate) {
			start = moment().format('YYYY-MM-DD');
		}
		if (!endDate) {
			end = start;
		}
		database.ref('matches')
			.orderByChild('utcDate')
			.startAt(start)
			.endAt(moment(end).add(1, 'days').format('YYYY-MM-DD'))
			.once('value').then((snapshot) => {
				const matches = {};
				snapshot.forEach((childSnapshot) => {
					const match = childSnapshot.val();
					const date = moment.utc(match.utcDate).format('YYYY-MM-DD');
					if (!has(matches, date)) matches[date] = [];
					matches[date].push(match);
				});
				// eslint-disable-next-line no-console
				console.log(`matches from ${start} to ${end}`)
				// eslint-disable-next-line no-console
				console.log(matches);
			});
	}

	static logMatchDates = (startDate, endDate) => {
		let start = startDate;
		let end = endDate;
		if (!startDate) {
			start = moment().format('YYYY-MM-DD');
		}
		if (!endDate) {
			end = start;
		}
		database.ref('matchDates')
			.orderByChild('date')
			.startAt(start)
			.endAt(end)
			.once('value').then((snapshot) => {
				const matchDates = {};
				snapshot.forEach((childSnapshot) => {
					const matchDate = childSnapshot.val();
					const { date } = matchDate;
					if (!has(matchDates, date)) matchDates[date] = {};
					Object.keys(matchDate).forEach((key) => {
						if (key !== 'date') matchDates[date][key] = matchDate[key];
					});
				});
				// eslint-disable-next-line no-console
				console.log(`matcheDates from ${start} to ${end}`)
				// eslint-disable-next-line no-console
				console.log(matchDates);
			});
	}
	
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
					const name = trimTeamName(team.name);

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