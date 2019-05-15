import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get } from './util';
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
			'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by',
		}
	}).then((response) => response.json()).then((data) => {
		const competitionArray = data.competitions;
		const competitionIds = Object.values(competitionIdSet);
		const results = {};

		competitionArray.forEach((competition) => {
			if (competitionIds.indexOf(competition.id) !== -1) {
				results[competition.id] = competition;
				firestore.doc(`competitions/${competition.id}`).set(competition);
			}
		});
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

				const results = {};
				const addCompetition = (competition) => {
					results[competition.id] = competition
				}

				return get(firestore
					.collection('competitions'), addCompetition)
					.then(() => dispatch(fetchCompetitionsCompleted(results)));
			});
	}

export default startFetchCompetitions;