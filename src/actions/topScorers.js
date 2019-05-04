import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
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
	
	result.competitionId = topScorers.competition.id;
	result.competitionName = topScorers.competition.name;
	result.areaId = topScorers.competition.area.id;
	result.areaName = topScorers.competition.area.name;
	result.seasonId = topScorers.season.id;
	result.startDate = topScorers.season.startDate;
	result.endDate = topScorers.season.endDate;
	result.currentMatchday = topScorers.season.currentMatchday;
	
	delete result.competition;
	delete result.season;
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

		database
			.ref(`topScorers/${competitionId}`)
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
				return database
					.ref(`topScorers/${competitionId}`)
					.once('value')
					.then((snapshot) => snapshot.val());
			})
			.then((topScorers) => {
				dispatch(fetchTopScorersCompleted(competitionId, topScorers));
			});
	}

export default startFetchTopScorers;