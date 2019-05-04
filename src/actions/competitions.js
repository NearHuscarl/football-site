import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime } from './util';
import Log from '../utilities/log'
import { competitionIds as competitionIdSet } from '../settings';

export const fetchCompetitionsPending = () => ({
	type: 'FETCH_COMPETITIONS_PENDING',
});

const fetchCompetitionsCompleted = (competitions) => ({
	type: 'FETCH_COMPETITIONS_COMPLETED',
	payload: {
		competitions,
	},
});

const refreshCompetitions = () => {
	// https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
	const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
	const url = 'http://api.football-data.org/v2/competitions';
	
	Log.debug('start getting competitions');
	return fetch(proxyUrl + url, {
		headers: {
			"Access-Control-Allow-Headers": "x-requested-with, x-requested-by",
		}
	}).then((response) => response.json()).then((data) => {
		const competitionArray = data.competitions;
		const results = {};
		const competitionIds = Object.values(competitionIdSet);
		competitionArray.forEach((competition) => {
			if (competitionIds.indexOf(competition.id) !== -1) {
				results[competition.id] = competition;
			}
		});

		database.ref('competitions').set(results);
		updateCacheTime('competitions');
		return results;
	});
}

const startFetchCompetitions = () =>
	(dispatch) => {
		dispatch(fetchCompetitionsPending());

		return checkCacheTime('competitions')
			.then((expired) => {
				if (expired) {
					return refreshCompetitions()
				}
				return database
					.ref('competitions')
					.once('value')
					.then((snapshot) => snapshot.val());
			})
			.then((competitions) => {
				dispatch(fetchCompetitionsCompleted(competitions));
			});
	}

export default startFetchCompetitions;