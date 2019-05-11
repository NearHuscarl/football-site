import upperFirst from 'lodash/upperFirst';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, filterRef, updateChildRef } from './util'
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

const flattenPlayerData = (player) => {
	const result = { ...player, ...player.stats };

	// Get the last word basically, since firebase doesn't offer full text search
	// We can only search by whole name or name prefix
	result.firstName = player.shortName.split(' ').pop();
	result.position = player.position.toString();
	result.team.position = player.team.position.toString();
	if (result.nationalTeam) result.nationalTeam.position = player.nationalTeam.position.toString();

	Object.keys(player.team).forEach((key) => {
		let newKey;
		if (key === 'loanTeamId' || key === 'loanFrom') {
			newKey = key;
		} else {
			newKey = 'team' + upperFirst(key);
		}
		result[newKey] = player.team[key];
	});

	Object.keys(player.nationalTeam || {}).forEach((key) => {
		const newKey = 'nationalTeam' + upperFirst(key);
		result[newKey] = player.nationalTeam[key];
	});

	delete result.stats;
	delete result.team;
	delete result.nationalTeam;

	return result;
}

const getPlayerDetails = () =>
	fetch('https://gist.githubusercontent.com/NearHuscarl/7f171acfdbb5ad4dd74d6676c30c587f/raw/0c424bff6dfed3b4b56be9e510c1eef82a3ac607/players.json')
		.then((response) => response.json());

const refreshPlayers = () => {
	Log.warning('start getting players');
	return getPlayerDetails()
		.then((players) => {
			const playerResults = [];

			players.forEach((p) => {
				const player = flattenPlayerData(p);
				playerResults.push(player);
				updateChildRef(database.ref('players'), 'id', { equalTo: player.id }, player)
					.then(() => console.log('updated player ' + player.name));
			});
			updateCacheTime('players');
			return playerResults;
		}).catch((err) => {
			Log.error(`refreshPlayers: ${err}`)
		});
}

const checkUpdatePlayers = () =>
	checkCacheTime('players')
		.then((expired) => {
			if (expired) {
				return refreshPlayers();
			}
			return Promise.resolve();
		})

export const startFetchPotentialPlayers = () =>
	(dispatch) => {
		dispatch(fetchPlayersPending());
		return filterRef(database.ref('players'), 'potential', {
			startAt: 85,
			limitToLast: 250,
		}).then((players) => {
			const potentialPlayers = players.map((player) => player.potential - player.overallRating >= 5);
			dispatch(fetchPlayersCompleted(potentialPlayers));
		})
	}

export const startFetchTopPlayers = () =>
	(dispatch) => {
		dispatch(fetchPlayersPending());

		return filterRef(database.ref('players'), 'overallRating', {
			startAt: 85,
			limitToLast: 20,
		}).then((players) => {
			dispatch(fetchPlayersCompleted(players));
		})
	}

export default checkUpdatePlayers;