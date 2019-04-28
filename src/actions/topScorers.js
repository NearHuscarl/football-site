import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'

export const fetchTopScorersPending = () => ({
	type: 'FETCH_TOP_SCORERS_PENDING',
});

const fetchTopScorersCompleted = (competitionId, scorers) => ({
	type: 'FETCH_TOP_SCORERS_COMPLETED',
	payload: {
		competitionId,
		scorers,
	},
});

const refreshTopScorer = (competitionId) => {
	let topScorerData = {};
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting top scorers: competitionId=${competitionId}`);
	return footballData.getScorersFromCompetition({
		competitionId,
	})
		.then((data) => {
			updateCacheTime(`topScorers/${competitionId}`);
			topScorerData = data;

			return database
				.ref(`cachedData/topScorers/${competitionId}/data`)
				.set(topScorerData);
		})
		.then(() => topScorerData)
		.catch((err) => {
			Log.error(`refreshTopScorer: ${err}`);
			return topScorerData;
		});
}

const startFetchTopScorers = (competitionId) =>
	(dispatch) => {
		dispatch(fetchTopScorersPending());

		return checkCacheTimeExpired(`topScorers/${competitionId}`)
			.then((result) => {
				const { expired } = result;
				let promise = Promise.resolve(null);

				if (expired) {
					promise = refreshTopScorer(competitionId)
				} else {
					promise = database
						.ref(`cachedData/topScorers/${competitionId}/data`)
						.once('value')
						.then((snapshot) => snapshot.val());
				}
				return promise;
			})
			.then((topScorers) => {
				dispatch(fetchTopScorersCompleted(competitionId, topScorers));
			});
	}

export default startFetchTopScorers;