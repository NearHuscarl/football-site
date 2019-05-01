import moment from 'moment';
import database from '../firebase/firebase';
import { refreshMatch } from './matches';
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

const checkIfNeedUpdate = (dateSnapshot, startDate, endDate) => {
	const dateDuration = moment(endDate).diff(moment(startDate), 'days') + 1;

	if (dateSnapshot.numChildren() < dateDuration) {
		return true;
	}
	
	let needUpdate = false;
	dateSnapshot.forEach((childSnapshot) => {
		if (childSnapshot.child('SCHEDULED').val() > 0 &&
			moment(childSnapshot.child('date').val()).isBefore(moment(), 'day')) {
			needUpdate = true;
		}
		return needUpdate; // true to break loop
	});
	return needUpdate;
}


const startSearchMatches = () => (dispatch, getState) => {
	dispatch(searchMatchesPending());
	const filters = getState().matchFilters;
	const startDate = moment(filters.date).format('YYYY-MM-DD');
	const endDate = moment(startDate).format('YYYY-MM-DD'); // TODO: add endDate filter

	return database
		.ref('matchDates')
		.orderByChild('date')
		.startAt(startDate)
		.endAt(endDate)
		.once('value').then((snapshop) => {
			if (checkIfNeedUpdate(snapshop, startDate, endDate)) {
				return refreshMatch({
					competitionIds: Object.keys(competitions).toString(),
					...getDateRangeToUpdateMatches(startDate),
				}).then((matches) => matches.filter((match) => {
					const utcDate = moment.utc(match.utcDate).format('YYYY-MM-DD');
					return (startDate <= utcDate && utcDate <= endDate);
				}));
			}

			Log.debug(`Start searching for matches on firebase startDate=${startDate} endDate=${endDate} competitions=${filters.competition}`);
			return database
				.ref('matches')
				.orderByChild('utcDate')
				.startAt(startDate)
				.endAt(moment(endDate).add(1, 'days').format('YYYY-MM-DD'))
				.once('value').then((snapshot) => {
					const matches = [];
					snapshot.forEach((childSnapshot) => {
						matches.push(childSnapshot.val());
					});
					return matches;
				});
		})
		.then((matches) => {
			const filteredResults = matches.filter((match) =>
				(match.competitionId === filters.competition || filters.competition === 'all'));
			dispatch(searchMatchesCompleted(filteredResults));
		});
}


export default startSearchMatches;