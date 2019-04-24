import moment from 'moment';
import has from 'lodash/has';
import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import { competitions } from '../settings';
import getDateRange from '../utilities/getDateRange';
import Log from '../utilities/log'
import min from '../utilities/min'
import max from '../utilities/max'

const matchStartDate = moment();
// const matchEndDate = moment();
const matchEndDate = moment(matchStartDate).add(10, 'days');

const defaultParams = {
	competitionIds: Object.values(competitions),
	dateFrom: matchStartDate.format('YYYY-MM-DD'),
	dateTo: matchEndDate.format('YYYY-MM-DD'), // maximum is 10-day difference
}

export const updateMatch = (matches) => ({
	type: 'UPDATE_MATCH',
	payload: {
		matches,
	},
});

export const refreshMatch = (params = defaultParams) => {
	const matchData = {};
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting matches: competitionIds=${params.competitionIds} dateFrom=${params.dateFrom} dateTo=${params.dateTo}`);
	return footballData.getMatches({
		status: 'SCHEDULED,LIVE,FINISHED',
		...params,
	})
		.then((data) => {
			updateCacheTime('matches');

			const promises = []
			const datesWithMatches = [];
			// dates which have at least one match which is not in FINISHED status
			const datesOngoing = {};
			console.log('data', data);
			const { matches } = data;

			matches.forEach((match) => {
				const date = moment.utc(match.utcDate).format('YYYY-MM-DD');
				let removeOldDate = Promise.resolve(null);

				if (!has(matchData, date)) {
					matchData[date] = [];
				}
				if (match.status !== 'FINISHED' && !datesOngoing[date]) {
					datesOngoing[date] = true;
				}
				if (!datesWithMatches.includes(date)) {
					removeOldDate = database
						.ref(`cachedData/matches/data/${date}/matches`)
						.remove();

					datesWithMatches.push(date);
				}

				removeOldDate.then(() => {
					matchData[date].push(match);
					promises.push(database
						.ref(`cachedData/matches/data/${date}/matches`)
						.push(match));
				});
			});

			const matchDates = getDateRange(moment(params.dateFrom), moment(params.dateTo));
			matchDates.forEach((date) => {
				const noMatches = !datesWithMatches.includes(date);
				const isOnGoing = !!datesOngoing[date];

				database
					.ref(`cachedData/matches/data/${date}/meta`)
					.set({
						'noMatches': noMatches,
						'onGoing': isOnGoing,
					});
			});

			return Promise.all(promises);
		})
		.then(() => matchData)
		.catch((err) => {
			Log.error(`refreshMatch: ${err}`);
			return matchData;
		});
}

export const getDateRangeToUpdate = (dates) => {
	const promises = [];
	const datesToUpdate = [];

	dates.forEach((date) => {
		promises.push(database
			.ref(`cachedData/matches/data/${date}`)
			.once('value')
			.then((snapshot) => {
				const meta = snapshot.child('meta').val();
				if (meta === null || meta.onGoing) {
					datesToUpdate.push(date);
				}
			}));
	});

	return Promise.all(promises).then(() => ({
		dateFrom: min(datesToUpdate),
		dateTo: max(datesToUpdate),
	}));
}

export const startUpdateMatch = () =>
	(dispatch) => checkCacheTimeExpired('matches')
		.then((result) => {
			const { expired } = result;
			const dates = getDateRange(matchStartDate, matchEndDate);

			if (expired) {
				return getDateRangeToUpdate(dates)
					.then((dateRangeToUpdate) => refreshMatch({
						competitions: defaultParams.competitions,
						...dateRangeToUpdate,
					}));
			}
			const matchData = {};
			const promises = [];

			dates.forEach((date) => {
				promises.push(database
					.ref(`cachedData/matches/data/${date}/matches`)
					.once('value')
					.then((snapshot) => {

						matchData[date] = [];
						snapshot.forEach((childSnapshot) => {
							matchData[date].push(childSnapshot.val());
						});
					}));
			});
			return Promise.all(promises).then(() => matchData);
		})
		.then((matches) => {
			dispatch(updateMatch(matches));
		})