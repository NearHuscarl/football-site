import moment from 'moment';
import has from 'lodash/has';
import FootballData from 'footballdata-api-v2';
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get } from './util'
import { competitionIds } from '../settings';
import getDateRange from '../utilities/getDateRange';
import Log from '../utilities/log'

const fetchMatchesPending = () => ({
	type: 'FETCH_MATCHES_PENDING',
});

const fetchMatchesCompleted = (matches) => ({
	type: 'FETCH_MATCHES_COMPLETED',
	payload: {
		matches,
	},
});

const defaultParams = {
	competitionIds: Object.values(competitionIds),
	dateFrom: moment().format('YYYY-MM-DD'),
	dateTo: moment().add(10, 'days').format('YYYY-MM-DD'), // maximum is 10-day difference
}

export const refreshMatch = (params = defaultParams) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);
	Log.warning(`start getting matches: competitionIds=${params.competitionIds} dateFrom=${params.dateFrom} dateTo=${params.dateTo}`);

	return footballData.getMatches({
		status: 'SCHEDULED,LIVE,FINISHED',
		...params,
	}).then((data) => {
		const { matches } = data;
		const matchDate = {};
		const matchResults = [];

		matches.forEach((match) => {
			const date = moment.utc(match.utcDate).format('YYYY-MM-DD');

			if (!has(matchDate, date)) matchDate[date] = {};
			if (!matchDate[date][match.status]) matchDate[date][match.status] = 0;
			matchDate[date][match.status] += 1;
			
			matchResults.push(match);
			firestore.doc(`matches/${match.id}`).set(match, { merge: true });
		});

		const dateRange = getDateRange(moment(params.dateFrom), moment(params.dateTo));
		dateRange.forEach((date) => {
			const matchDatePayload = { date, ...matchDate[date] };
			firestore.doc(`matchDates/${date}`).set(matchDatePayload, { merge: true });
		});

		updateCacheTime('matches');
		return matchResults;
	});
}

const startFetchMatches = () =>
	(dispatch) => {
		dispatch(fetchMatchesPending());

		return checkCacheTime('matches')
			.then((expired) => {
				if (expired) {
					return refreshMatch();
				}

				return get(firestore
					.collection('matches')
					.where('utcDate', '>=', moment().format('YYYY-MM-DD'))
					.where('utcDate', '<', moment().add(11, 'days').format('YYYY-MM-DD')));
			})
			.then((matches) => {
				dispatch(fetchMatchesCompleted(matches));
			});
	}

export default startFetchMatches;