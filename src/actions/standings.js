import FootballData from 'footballdata-api-v2';
import has from 'lodash/has';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'
import teamLogos from '../utilities/teamLogos';

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

const startFetchStanding = (competitionId) =>
	(dispatch) => {
		dispatch(fetchStandingPending(competitionId));

		return checkCacheTimeExpired(`standings/${competitionId}`)
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
			.then((result) => {
				const standing = result;

				// Update obsolete logo urls
				standing.standings.forEach((s, standingIndex) => {
					s.table.forEach((rank, tableIndex) => {
						const teamId = rank.team.id;
						if (has(teamLogos, teamId)) {
							standing.standings[standingIndex].table[tableIndex].team.crestUrl = teamLogos[teamId];
						}
					});
				});
				dispatch(fetchStandingCompleted(competitionId, standing));
			})
	}

export default startFetchStanding;