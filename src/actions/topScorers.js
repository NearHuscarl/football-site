import FootballData from 'footballdata-api-v2';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime } from './util';
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

const flattenTopScorersData = (topScorers) => {
	const result = topScorers;
	
	result.area = topScorers.competition.area;
	result.competition = { id: topScorers.competition.id, name: topScorers.competition.name };
	
	delete result.season.winner;
	delete result.count;
	delete result.filters;
	
	return result;
}

const refreshTopScorer = (competitionId) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting top scorers: competitionId=${competitionId}`);
	return footballData.getScorersFromCompetition({
		competitionId,
	}).then((data) => {
		const topScorers = flattenTopScorersData(data);

		firestore.doc(`topScorers/${competitionId}`)
			.set(topScorers)
			.then(() => updateCacheTime('topScorers', competitionId));
		return topScorers;
	}).catch((err) => {
		Log.error(`refreshTopScorer: ${err}`);
	});
}

const startFetchTopScorers = (competitionId) =>
	(dispatch) => {
		dispatch(fetchTopScorersPending());

		return checkCacheTime('topScorers', competitionId)
			.then((expired) => {
				if (expired) {
					return refreshTopScorer(competitionId)
				}
				return firestore
					.doc(`topScorers/${competitionId}`)
					.get()
					.then((doc) => doc.data());
			})
			.then((topScorers) => {
				dispatch(fetchTopScorersCompleted(competitionId, topScorers));
			});
	}

export default startFetchTopScorers;