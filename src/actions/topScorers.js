import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'

const updateTopScorers = (competitionId, scorers) => ({
	type: 'UPDATE_TOP_SCORERS',
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

const startUpdateTopScorers = (competitionId) =>
	(dispatch) => checkCacheTimeExpired(`topScorers/${competitionId}`)
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
			dispatch(updateTopScorers(competitionId, topScorers));
		});

export default startUpdateTopScorers;