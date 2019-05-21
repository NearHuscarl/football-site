import defaultsDeep from 'lodash/defaultsDeep';
import has from 'lodash/has';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import moment from 'moment';
import firestore from './firebase';
import hashMultipleWords from '../utilities/hashMultipleWords'
import trimTeamName from '../utilities/trimTeamName';

class FirebaseUtil {
	static logArticles = (startDate, endDate) => {
		let start = startDate;
		let end = endDate;
		if (!startDate) {
			start = moment().format('YYYY-MM-DD');
		}
		if (!endDate) {
			end = start;
		}
		firestore.collection('articles')
			.where('publishedAt', '>=', start)
			.where('publishedAt', '<', moment(end).add(1, 'days').format('YYYY-MM-DD'))
			.get().then((querySnapshot) => {
				const articles = {};
				const urls = [];
				querySnapshot.forEach((childSnapshot) => {
					const article = childSnapshot.data();
					const date = moment.utc(article.publishedAt).format('YYYY-MM-DD');
					if (!has(articles, date)) articles[date] = [];
					articles[date].push(article);
					urls.push(article.url);
				});
				// eslint-disable-next-line no-console
				console.log(`articles from ${start} to ${end}`)
				// eslint-disable-next-line no-console
				console.log(articles);
				console.log('urls:', urls);
				console.log('unique urls', uniq(urls));
			});
	}
	
	static logMatches = (startDate, endDate) => {
		let start = startDate;
		let end = endDate;
		if (!startDate) {
			start = moment().format('YYYY-MM-DD');
		}
		if (!endDate) {
			end = start;
		}
		firestore.collection('matches')
			.where('utcDate', '>=', start)
			.where('utcDate', '<', moment(end).add(1, 'days').format('YYYY-MM-DD'))
			.get().then((querySnapshot) => {
				const matches = {};
				querySnapshot.forEach((doc) => {
					const match = doc.data();
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
		firestore.collection('matchDates')
			.where('date', '>=', start)
			.where('date', '<=', end)
			.get().then((querySnapshot) => {
				const matchDates = {};
				querySnapshot.forEach((doc) => {
					const matchDate = doc.data();
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


	static getTeamNamesByCompetition = () =>
		firestore.collection('teams').get().then((querySnapshot) => {
			const teamNames = {};

			querySnapshot.forEach((doc) => {
				const team = doc.data();
				const competition = camelCase(team.competition.name);
				if (!teamNames[competition]) teamNames[competition] = {};
				
				teamNames[competition][team.id] = trimTeamName(team.name);
			});

			return teamNames;
		})

	static getAllTeamNames = () =>
		firestore.collection('teams').get().then((querySnapshot) => {
			const teamNames = {
				shortName: [],
				name: [],
				dict: {
					shortName: {},
					name: {},
				},
			};

			querySnapshot.forEach((doc) => {
				const team = doc.data();
				const { shortName } = team;
				const name = trimTeamName(team.name);

				teamNames.shortName.push(shortName);
				teamNames.name.push(name);

				teamNames.dict.shortName[shortName] = team.id;
				teamNames.dict.name[name] = team.id;
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