import moment from 'moment';
import firestore from '../firebase/firebase';
import { refreshMatch } from './matches';
import { get } from './util';
import { competitions } from '../settings';
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

const getDateRangeToUpdateMatches = (date) => {
	if (moment(date).isSameOrAfter(moment(), 'day')) {
		return {
			dateFrom: moment(date).format('YYYY-MM-DD'),
			dateTo: moment(date).add(10, 'days').format('YYYY-MM-DD'),
		};
	}
	return {
		dateFrom: moment(date).subtract(10, 'days').format('YYYY-MM-DD'),
		dateTo: moment(date).format('YYYY-MM-DD'),
	};
}

/**
 * 
 * @param {string} startDate 
 * @param {string} endDate
 */
const checkIfNeedUpdate = (startDate, endDate) =>
	firestore
		.collection('matchDates')
		.where('date', '>=', startDate)
		.where('date', '<=', endDate)
		.get().then((querySnapshot) => {
			const dateDuration = moment(endDate).diff(moment(startDate), 'days') + 1;

			if (querySnapshot.size < dateDuration) {
				return true;
			}
			
			let needUpdate = false;
			querySnapshot.docs.some((doc) => {
				const matchDate = doc.data();
				if (matchDate.SCHEDULED && matchDate.SCHEDULED > 0 &&
					moment(matchDate.date).isBefore(moment(), 'day')) {
					needUpdate = true;
				}
				return needUpdate; // true to break loop
			});
			return needUpdate;
		})

const startSearchMatches = () => (dispatch, getState) => {
	dispatch(searchMatchesPending());
	const filters = getState().matchFilters;
	const startDate = moment(filters.date).format('YYYY-MM-DD');
	const endDate = moment(startDate).format('YYYY-MM-DD'); // TODO: add endDate filter

	return checkIfNeedUpdate(startDate, endDate)
		.then((needUpdate) => {
			if (needUpdate) {
				return refreshMatch({
					competitionIds: Object.keys(competitions).toString(),
					...getDateRangeToUpdateMatches(startDate),
				}).then((matches) => matches.filter((match) => {
					const utcDate = moment.utc(match.utcDate).format('YYYY-MM-DD');
					return (startDate <= utcDate && utcDate <= endDate);
				}));
			}

			Log.debug(`Start searching for matches on firebase startDate=${startDate} endDate=${endDate} competitions=${filters.competition}`);
			return get(firestore.collection('matches')
				.where('utcDate', '>=', startDate)
				.where('utcDate', '<', moment(endDate).add(1, 'days').format('YYYY-MM-DD')));
		})
		.then((matches) => {
			const filteredResults = matches.filter((match) =>
				(match.competition.id === filters.competition || filters.competition === 'all'));
			dispatch(searchMatchesCompleted(filteredResults));
		});
}


export default startSearchMatches;