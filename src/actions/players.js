import invert from 'lodash/invert';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get } from './util'
import footballDataToSofifaTeamId from '../utilities/footballDataToSofifaTeamId';
import Log from '../utilities/log'

export const fetchPlayersPending = () => ({
	type: 'FETCH_PLAYERS_PENDING',
});

export const fetchPlayersCompleted = (players) => ({
	type: 'FETCH_PLAYERS_COMPLETED',
	payload: {
		players,
	},
});

const processPlayerData = (player, fdTeamDict) => {
	const result = player;

	// Get the last word basically, since firebase doesn't offer full text search
	// We can only search by whole name or name prefix
	result.firstName = player.shortName.split(' ').pop();
	result.team.id = Number(fdTeamDict[player.team.id]) || -1;

	return result;
}

export const getPlayerDetails = () =>
	fetch('https://gist.githubusercontent.com/NearHuscarl/7f171acfdbb5ad4dd74d6676c30c587f/raw/289f512e4acd2c7ec255b06243d0d15e0b4d7466/players.json')
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

export const startFetchPotentialPlayers = () =>
	(dispatch) => {
		dispatch(fetchPlayersPending());
		return get(firestore.collection('players')
			.where('potential', '>=', 85)
			.orderBy('potential', 'desc')
			.limit(250)).then((players) => {
			const potentialPlayers = players.filter((player) => player.potential - player.overallRating >= 5);
			dispatch(fetchPlayersCompleted(potentialPlayers));
		})
	}

export const startFetchTopPlayers = () =>
	(dispatch) => {
		dispatch(fetchPlayersPending());

		return get(firestore.collection('players')
			.where('overallRating', '>=', 85)
			.orderBy('overallRating', 'desc')
			.limit(20))
			.then((players) => dispatch(fetchPlayersCompleted(players)))
	}

export default checkUpdatePlayers;