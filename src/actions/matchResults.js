import database from '../firebase/firebase';
import moment from 'moment';
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
    let dates = {};

    if (moment(date).isSameOrAfter(moment(), 'day')) {
        dates.dateFrom = moment(date);
        dates.dateTo = moment(date).add(10, 'days');
    } else {
        dates.dateFrom = moment(date).subtract(10, 'days');
        dates.dateTo = moment(date);
    }
    const dateRange = getDateRange(dates.dateFrom, dates.dateTo);
    console.log(dateRange);
    return getDateRangeToUpdate(dateRange);
}

export const startSearchMatches = () => {
    return (dispatch, getState) => {
        dispatch(searchMatchesPending());
        const filters = getState().matchFilters;
        const date = filters.date.format('YYYY-MM-DD');
        const { matches } = getState();

        const updateSearchResults = (results = []) => {
            const filteredResults = results.filter((match) => {
                return (match.competition.id === filters.competition || filters.competition === 'all');
            });
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
                let matches = [];
                
                snapshot.child('matches').forEach((childSnapshot) => {
                    matches.push(childSnapshot.val());
                });
                return {
                    noMatches: snapshot.child('meta').child('noMatches').val(),
                    matches,
                };
            })
            .then((results) => {
                if (results.noMatches) { // no matches on that day
                    return [];
                }
                if (results.noMatches === null) { // data not available on firebase, start calling API
                    const competitions = Object.keys(competitionNames).toString();
                    return getDateRangeToCacheMatches(date)
                    .then((datesUpdate) => {
                        return refreshMatch({
                            competitions,
                            ...datesUpdate,
                        });
                    })
                    .then((matches) => {
                        return matches[date];
                    });
                } else {
                    return results.matches;
                }
            }).then((matches) => {
                updateSearchResults(matches);
                dispatch(updateMatch({ [date]: matches }));
            });
    }
}