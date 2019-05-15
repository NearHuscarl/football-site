import FootballData from 'footballdata-api-v2';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get, update } from './util';
import Log from '../utilities/log'

const fetchStandingPending = (competitionId) => ({
	type: 'FETCH_STANDING_PENDING',
	payload: {
		competitionId,
	},
});

const fetchStandingCompleted = (competitionId, standing) => ({
	type: 'FETCH_STANDING_COMPLETED',
	payload: {
		competitionId,
		standing,
	},
});

const flattenStandingData = (standing) => {
	const result = standing;
	
	result.area = standing.competition.area;
	result.competition = { id: standing.competition.id, name: standing.competition.name };
	
	const standingArray = standing.standings;
	result.standings = {};
	standingArray.forEach((s) => {
		result.standings[s.type.toLowerCase()] = s.table;
	});
	
	delete result.season.winner;
	delete result.filters;
	
	return result;
}

const refreshStanding = (competitionId) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting standing: competitionId=${competitionId}`);
	return footballData.getStandingsFromCompetition({
		competitionId,
	}).then((data) => {
		const standings = flattenStandingData(data);
		
		update(firestore.collection('standings')
			.where('competition.id', '==', competitionId), standings)
			.then(() => updateCacheTime('standings', competitionId));
		return standings;
	}).catch((err) => {
		Log.error(`refreshStanding: ${err}`);
	});
}

const startFetchStanding = (competitionId) =>
	(dispatch) => {
		dispatch(fetchStandingPending(competitionId));

		return checkCacheTime('standings', competitionId)
			.then((expired) => {
				if (expired) {
					return refreshStanding(competitionId);
				}
				return get(firestore.collection('standings')
					.where('competition.id', '==', competitionId))
					.then((result) => result[0]);
			})
			.then((standing) => {
				dispatch(fetchStandingCompleted(competitionId, standing));
			})
	}

export default startFetchStanding;