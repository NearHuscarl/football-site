import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'

const updateStanding = (competitionId, standing) => ({
	type: 'UPDATE_STANDING',
	payload: {
		competitionId,
		standing,
	},
});

const refreshStanding = (competitionId) => {
	let standings = {};
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting standing: competitionId=${competitionId}`);
	return footballData.getStandingsFromCompetition({
		competitionId,
	})
		.then((data) => {
			updateCacheTime(`standings/${competitionId}`);
			standings = data;

			return database
				.ref(`cachedData/standings/${competitionId}/data`)
				.set(data);
		})
		.then(() => standings)
		.catch((err) => {
			Log.error(`refreshStanding: ${err}`);
			return standings;
		});
}

const startUpdateStanding = (competitionId) =>
	(dispatch) => checkCacheTimeExpired(`standings/${competitionId}`)
		.then((result) => {
			const { expired } = result;
			let promise = Promise.resolve(null);

			if (expired) {
				promise = refreshStanding(competitionId);
			} else {
				promise = database
					.ref(`cachedData/standings/${competitionId}/data`)
					.once('value')
					.then((snapshot) => snapshot.val());
			}
			return promise;
		})
		.then((standing) => {
			dispatch(updateStanding(competitionId, standing));
		})

export default startUpdateStanding;