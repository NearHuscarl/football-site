import firestore from '../firebase/firebase';
import getAge from '../utilities/getAge';
import getBirthday from '../utilities/getBirthday';

const fetchPlayersPending = (mode) => ({
	type: 'FETCH_PLAYERS_PENDING',
	payload: {
		mode,
	}
});

const fetchPlayersCompleted = (players, lastDocument) => ({
	type: 'FETCH_PLAYERS_COMPLETED',
	payload: {
		players,
		lastDocument,
	},
});

const fetchMorePlayersCompleted = (players, lastDocument) => ({
	type: 'FETCH_MORE_PLAYERS_COMPLETED',
	payload: {
		players,
		lastDocument,
	},
});

const computeAge = (player) => {
	const playerWithAge = player;
	playerWithAge.age = getAge(player.birthday);
	return playerWithAge;
}

/**
 * 
 * @param {firebase.firestore.CollectionReference} collection 
 * @param {object} filters 
 */
const applyEqualQuery = (collection, filters) => {
	let query = collection;

	if (filters.query.length > 0) {
		query = query.where(`_query.name.${filters.query}`, '==', true);
	}

	if (filters.nationality.length > 0) {
		query = query.where('country', '==', filters.nationality);
	}

	if (filters.team.id) {
		query = query.where('team.id', '==', filters.team.id);
	}

	if (filters.position.length > 0) {
		query = query.where('position', 'array-contains', filters.position);
	}

	if (filters.preferredFoot.length > 0) {
		query = query.where('stats.preferredFoot', '==', filters.preferredFoot);
	}

	if (filters.reputation !== -1) {
		query = query.where('stats.internationalReputation', '==', filters.reputation);
	}

	if (filters.skillMoves !== -1) {
		query = query.where('stats.skillMoves', '==', filters.skillMoves);
	}

	if (filters.weakFoot !== -1) {
		query = query.where('stats.weakFoot', '==', filters.weakFoot);
	}

	return query;
}

/**
 * 
 * @param {object} filters 
 */
const getQueriesFromFilters = (filters) => {
	const collection = firestore.collection('players');

	if (filters.filterType === 'General') {
		return applyEqualQuery(collection, filters);
	}

	if (filters.filterType === 'Age') {
		return collection
			.where(`_query.name_birthday.${filters.query}`, '>=', getBirthday(filters.maxAge + 1))
			.where(`_query.name_birthday.${filters.query}`, '<=', getBirthday(filters.minAge))
			.orderBy(`_query.name_birthday.${filters.query}`, 'asc');
	}

	if (filters.filterType === 'Overall Rating') {
		return collection
			.where(`_query.name_rating.${filters.query}`, '>=', filters.minRating)
			.where(`_query.name_rating.${filters.query}`, '<=', filters.maxRating)
			.orderBy(`_query.name_rating.${filters.query}`, 'desc');
	}

	if (filters.filterType === 'Potential') {
		return collection
			.where(`_query.name_potential.${filters.query}`, '>=', filters.minPotential)
			.where(`_query.name_potential.${filters.query}`, '<=', filters.maxPotential)
			.orderBy(`_query.name_potential.${filters.query}`, 'desc');
	}

	return collection;
}

/**
 * 
 * @param {string} mode 
 * @param {object} filters 
 */
const getQueries = (mode) => {
	if (mode === 'top') {
		return firestore.collection('players')
			.where('overallRating', '>=', 85)
			.orderBy('overallRating', 'desc');
	} if (mode === 'potential') {
		return firestore.collection('players')
			.orderBy('_query.potentialScore', 'desc');
	}
	throw Error(`Unknown mode: ${mode}`)
}

/**
 * 
 * @param {firebase.firestore.Query} query 
 */
const getPlayersFromQuery = (query) => {
	const searchLimit = 20;

	return query.limit(searchLimit)
		.get().then((querySnapshot) => {
			const players = querySnapshot.docs.map((doc) => computeAge(doc.data()));
			const playerCount = querySnapshot.docs.length;
			let lastDocument;

			if (playerCount === searchLimit) {
				lastDocument = querySnapshot.docs[playerCount - 1];
			} else {
				lastDocument = null;
			}
			return { players, lastDocument };
		});
}

const startSearchPlayers = () =>
	(dispatch, getState) => {
		dispatch(fetchPlayersPending('search'));
		const filters = getState().playerFilters;
		const query = getQueriesFromFilters(filters);

		return getPlayersFromQuery(query)
			.then((result) => dispatch(fetchPlayersCompleted(result.players, result.lastDocument)));
	}

export const startFetchMorePlayers = () =>
	(dispatch, getState) => {
		dispatch(fetchPlayersPending());
		const filters = getState().playerFilters;
		const { mode } = getState().players;
		const { lastDocument } = getState().players;
		if (!lastDocument) return Promise.resolve();
		let query;

		if (mode === 'search') {
			query = getQueriesFromFilters(filters);
		} else {
			query = getQueries(mode);
		}

		return getPlayersFromQuery(query.startAfter(lastDocument))
			.then((result) => dispatch(fetchMorePlayersCompleted(result.players, result.lastDocument)))
	}

export const startFetchPlayers = (mode) =>
	(dispatch) => {
		if (!mode) return Promise.resolve();
		dispatch(fetchPlayersPending(mode));

		return getPlayersFromQuery(getQueries(mode))
			.then((result) => dispatch(fetchPlayersCompleted(result.players, result.lastDocument)))
	}

export default startSearchPlayers;