import moment from 'moment';
import database from '../firebase/firebase';
import { refreshMatch, updateMatch, getDateRangeToUpdate } from './matches';
import { competitionNames } from '../settings';
import getDateRange from '../utilities/getDateRange';
import Log from '../utilities/log';

const searchMatchesPending = () => ({
	type: 'SEARCH_MATCHES_PENDING',
});

const searchMatchesCompleted = (results) => ({
	type: 'SEARCH_MATCHES_COMPLETED',
	payload: {
		results,
	},
});

const getDateRangeToCacheMatches = (date) => {
	const dates = {};

	if (moment(date).isSameOrAfter(moment(), 'day')) {
		dates.dateFrom = moment(date);
		dates.dateTo = moment(date).add(10, 'days');
	} else {
		dates.dateFrom = moment(date).subtract(10, 'days');
		dates.dateTo = moment(date);
	}
	const dateRange = getDateRange(dates.dateFrom, dates.dateTo);
	return getDateRangeToUpdate(dateRange);
}

const startSearchMatches = () => (dispatch, getState) => {
	dispatch(searchMatchesPending());
	const filters = getState().matchFilters;
	const date = moment(filters.date).format('YYYY-MM-DD');
	const { matches } = getState();

	const updateSearchResults = (results = []) => {
		const filteredResults = results.filter((match) =>
			(match.competition.id === filters.competition || filters.competition === 'all'));
		dispatch(searchMatchesCompleted(filteredResults));
	}

	if (matches[date]) {
		updateSearchResults(matches[date]);
		return Promise.resolve(null);
	}

	Log.debug(`Start searching for matches on firebase date=${date}`);
	return database
		.ref(`cachedData/matches/data/${date}`)
		.once('value')
		.then((snapshot) => {
			const matchData = [];

			snapshot.child('matches').forEach((childSnapshot) => {
				matchData.push(childSnapshot.val());
			});
			return {
				meta: snapshot.child('meta').val(),
				noMatches: snapshot.child('meta').child('noMatches').val(),
				matches: matchData,
			};
		})
		.then((results) => {
			// data not available on firebase or some matches need updating, start calling API
			if (results.meta === null || (results.meta.onGoing && moment(date).isBefore(moment(), 'day'))) {
				const competitionIds = Object.keys(competitionNames).toString();
				return getDateRangeToCacheMatches(date)
					.then((datesUpdate) => refreshMatch({
						competitionIds,
						...datesUpdate,
					}))
					.then((m) => m[date]);
			}

			if (results.meta.noMatches) { // no matches on that day
				return [];
			}
			
			return results.matches;
		}).then((m) => {
			updateSearchResults(m);
			dispatch(updateMatch({ [date]: m }));
		});
}

export default startSearchMatches;