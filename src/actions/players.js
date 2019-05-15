import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get, batchUpdate } from './util'
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

const computeFirstName = (player) => {
	const result = player;

	// Get the last word basically, since firebase doesn't offer full text search
	// We can only search by whole name or name prefix
	result.firstName = player.shortName.split(' ').pop();

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
			let batch = firestore.batch();
			let queries = [];
			let playerCountFromLastBatch = 0;

			await players.reduce((prev, p, index) =>
				prev.then(async () => {
					const player = computeFirstName(p);
					const playerCount = index + 1;

					queries.push(batchUpdate(batch,
						firestore.collection('players').where('id', '==', player.id), player)
						.then((isUpdated) => {
							const operation = isUpdated ? 'update' : 'add';
							console.log(`${playerCount} ${operation} player ${player.name}`)
						}));
	
					if (playerCount % maxBatchWriteOperations === 0 || playerCount === players.length) {
						await Promise.all(queries);
						await batch.commit().then(() => {
							Log.debug(`batch update players: ${playerCountFromLastBatch + 1}-${playerCount}`);
							batch = firestore.batch(); // get a new write batch
							queries = [];
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