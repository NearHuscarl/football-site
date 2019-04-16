import database from '../firebase/firebase';
import moment from 'moment';
import FootballData from 'footballdata-api-v2';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import { competitions } from '../settings';
import getDateRange from '../utilities/getDateRange';

const updateFixture = (fixtures) => ({
    type: 'UPDATE_FIXTURE',
    fixtures,
});

const fixtureStartDate = moment();
const fixtureEndDate = moment(fixtureStartDate).add(10, 'days');

const refreshFixture = () => {
    let fixtureData = {};
    const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

    return footballData.getMatches({
        competitions: Object.values(competitions).toString(),
        dateFrom: fixtureStartDate.format('YYYY-MM-DD'),
        dateTo: fixtureEndDate.format('YYYY-MM-DD'), // maximum is 10-day difference
        status: 'SCHEDULED',
    })
    .then((data) => {
        updateCacheTime('fixtures');

        let promises = []
        let fixtureData = {};
        const { matches } = data;

        matches.forEach((match) => {
            const date = moment(match.utcDate).format('YYYY-MM-DD');
            if (!fixtureData.hasOwnProperty(date)) {
                fixtureData[date] = [];
            }
            
            fixtureData[date].push(match);
            promises.push(database
                .ref(`cachedData/fixtures/data/${date}`)
                .push(match));
        });

        return Promise.all(promises);
    })
    .then(() => {
        return fixtureData;
    })
    .catch((err) => {
        console.log('refreshFixture:', err);
        return fixtureData;
    });
}

export const startUpdateFixture = () => {
    return (dispatch) => {
        return checkCacheTimeExpired('fixtures')
            .then((result) => {
                const { expired } = result;

                if (expired) {
                    return refreshFixture()
                } else {
                    let fixtureData = {};
                    let promises = [];

                    getDateRange(fixtureStartDate, fixtureEndDate)
                    .forEach((date) => {
                        promises.push(database
                            .ref(`cachedData/fixtures/data/${date}`)
                            .once('value')
                            .then((snapshot) => {

                                fixtureData[date] = [];
                                snapshot.forEach((childSnapshot) => {
                                    fixtureData[date].push(childSnapshot.val());
                                });
                            }));
                        });
                    return Promise.all(promises).then(() => fixtureData);
                }
            })
            .then((fixtures) => {
                dispatch(updateFixture(fixtures));
            });
    }
}