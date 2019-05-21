import deburr from 'lodash/deburr';
import invert from 'lodash/invert';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime } from './util'
import footballDataToSofifaTeamId from '../utilities/footballDataToSofifaTeamId';
import getAge from '../utilities/getAge';
import getWeight from '../utilities/getWeight';
import Log from '../utilities/log';

const getPotentialScore = (player) => {
	const { potential, overallRating } = player;
	const age = getAge(player.birthday);

	return Number((
		getWeight(potential, 85, 100) +
		getWeight(overallRating, 75, 100) +
		getWeight(age, 25, 15) +
		getWeight(potential - overallRating, 0, 50) * 2
	).toFixed(5));
}

const processPlayerData = (player, fdTeamDict) => {
	const result = player;

	result._query = {};

	// Since firestore query does not offer full text search like
	// SQL query without third party services like elastic search which
	// are not free. The workaround here is to split the name into
	// array of words and store in C#-like hashset then search for whole word
	// something like: query.where(`_query.name.${query}`, '==', true)
	const name = deburr(player.name.toLowerCase());
	const nameArray = name.split(/\s+/);

	const nameDict = {}; // { 'messi': true }
	nameArray.forEach((word) => (nameDict[word] = true));
	result._query.name = nameDict;

	const nameBirthdayDict = {}; // { 'messi': '1981-01-01' }
	const { birthday } = player; 
	nameArray.forEach((word) => (nameBirthdayDict[word] = birthday))
	result._query.name_birthday = nameBirthdayDict;

	const nameRatingDict = {}; // { 'messi': 95 }
	const { overallRating } = player; 
	nameArray.forEach((word) => (nameRatingDict[word] = overallRating))
	result._query.name_rating = nameRatingDict;

	const namePotentialDict = {}; // { 'messi': 95 }
	const { potential } = player; 
	nameArray.forEach((word) => (namePotentialDict[word] = potential))
	result._query.name_potential = namePotentialDict;

	result._query.potentialScore = getPotentialScore(player);
	result.team.id = Number(fdTeamDict[player.team.id]) || -1;

	return result;
}

export const getPlayerDetails = () =>
	fetch('https://gist.githubusercontent.com/NearHuscarl/7f171acfdbb5ad4dd74d6676c30c587f/raw/63facf51e06074feeb7900ac142024c7adde03eb/players.json')
		.then((response) => response.json());

const refreshPlayers = () => {
	Log.warning('start getting players');
	return getPlayerDetails()
		.then(async (players) => {
			const maxBatchWriteOperations = 500;
			const fdTeamDict = invert(footballDataToSofifaTeamId);
			let batch = firestore.batch();
			let playerCountFromLastBatch = 0;

			await players.reduce((prev, p, index) =>
				prev.then(async () => {
					const player = processPlayerData(p, fdTeamDict);
					const playerCount = index + 1;
					const playerRef = firestore.doc(`players/${player.id}`);

					batch.set(playerRef, player, { merge: true });
	
					if (playerCount % maxBatchWriteOperations === 0 || playerCount === players.length) {
						await batch.commit().then(() => {
							Log.debug(`batch update players: ${playerCountFromLastBatch + 1}-${playerCount}`);
							batch = firestore.batch(); // get a new write batch
							playerCountFromLastBatch = playerCount;
						});
					}
				}), Promise.resolve());

			Log.debug('update players completed');
			updateCacheTime('players');
		}).catch((err) => {
			Log.error(`refreshPlayers: ${err}`)
		});
}

const checkUpdatePlayers = (force = false) =>
	checkCacheTime('players')
		.then((expired) => {
			if (force || expired) {
				return refreshPlayers();
			}
			return Promise.resolve();
		});

export default checkUpdatePlayers;