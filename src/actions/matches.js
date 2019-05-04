import moment from 'moment';
import has from 'lodash/has';
import FootballData from 'footballdata-api-v2';
import database from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, filterRef, updateChildRef } from './util'
import { competitionIds } from '../settings';
import getDateRange from '../utilities/getDateRange';
import Log from '../utilities/log'

export const fetchMatchesPending = () => ({
	type: 'FETCH_MATCHES_PENDING',
});

export const fetchMatchesCompleted = (matches) => ({
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

const flattenMatchData = (match) => {
	const result = match;
	
	result.competitionId = match.competition.id;
	result.competitionName = match.competition.name;
	result.awayTeamId = match.awayTeam.id;
	result.awayTeamName = match.awayTeam.name;
	result.homeTeamId = match.homeTeam.id;
	result.homeTeamName = match.homeTeam.name;
	
	delete result.competition;
	delete result.homeTeam;
	delete result.awayTeam;
	
	return result;
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

		matches.forEach((m) => {
			const match = flattenMatchData(m);
			const date = moment.utc(match.utcDate).format('YYYY-MM-DD');

			if (!has(matchDate, date)) matchDate[date] = {};
			if (!matchDate[date][match.status]) matchDate[date][match.status] = 0;
			matchDate[date][match.status] += 1;
			
			matchResults.push(match);
			updateChildRef(database.ref('matches'), 'id', { equalTo: match.id }, match);
		});

		const dateRange = getDateRange(moment(params.dateFrom), moment(params.dateTo));
		dateRange.forEach((date) => {
			const matchDatePayload = { date, ...matchDate[date] };
			updateChildRef(database.ref('matchDates'), 'date', { equalTo: date }, matchDatePayload);
		});

		updateCacheTime('matches');
		return matchResults;
	});
}

export const startFetchMatch = () =>
	(dispatch) => {
		dispatch(fetchMatchesPending());

		return checkCacheTime('matches')
			.then((expired) => {
				if (expired) {
					return refreshMatch();
				}

				return filterRef(database.ref('matches'), 'utcDate', {
					startAt: moment().format('YYYY-MM-DD'),
					endAt: moment().add(11, 'days').format('YYYY-MM-DD'),
				});
			})
			.then((matches) => {
				dispatch(fetchMatchesCompleted(matches));
			});
	}