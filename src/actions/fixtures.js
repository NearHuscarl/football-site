import database from '../firebase/firebase';
import moment from 'moment';
import FootballData from 'footballdata-api-v2';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import { tierOneCommpetitions } from '../settings';

const updateFixture = (fixtures) => ({
    type: 'UPDATE_FIXTURE',
    fixtures,
});

const refreshFixture = () => {
    let fixtureData = {};
    const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

    return footballData.getMatches({
        competitions: Object.values(tierOneCommpetitions).toString(),
        dateFrom: moment().format('YYYY-MM-DD'),
        dateTo: moment().add(9, 'days').format('YYYY-MM-DD'),
        status: 'SCHEDULED',
    })
    .then((data) => {
        updateCacheTime('fixtures');

        const { matches } = data;
        matches.forEach((match) => {
            if (fixtureData[match.competition.id] === undefined) {
                fixtureData[match.competition.id] = [];
            }

            fixtureData[match.competition.id].push(match);
        })
            
        return database
            .ref('cachedData/fixtures/data')
            .set(fixtureData);
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
                let promise = Promise.resolve(null);

                if (expired) {
                    promise = refreshFixture()
                } else {
                    promise = database
                        .ref('cachedData/fixtures/data')
                        .once('value')
                        .then((snapshot) => snapshot.val());
                }
                return promise;
            })
            .then((fixtures) => {
                dispatch(updateFixture(fixtures));
            });
    }
}