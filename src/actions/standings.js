import database from '../firebase/firebase';
import FootballData from 'footballdata-api-v2';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'

const updateStanding = (competitionId, standing) => ({
    type: 'UPDATE_STANDING',
    competitionId,
    standing,
});

const refreshStanding = (competitionId) => {
    let standings = {};
    const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

    Log.warning(`start getting standing: competitionId=${competitionId}`);
    return footballData.getStandingsFromCompetition({
        id: competitionId,
        standingType: 'TOTAL',
    })
    .then((data) => {
        updateCacheTime(`standings/${competitionId}`);
        standings = data;
            
        return database
            .ref(`cachedData/standings/${competitionId}/data`)
            .set(data);
    })
    .then(() => {
        return standings;
    })
    .catch((err) => {
        console.log('refreshStanding:', err);
        return standings;
    });
}

export const startUpdateStanding = (competitionId) => {
    return (dispatch) => {
        return checkCacheTimeExpired(`standings/${competitionId}`)
            .then((result) => {
                const { expired } = result;
                let promise = Promise.resolve(null);

                if (expired) {
                    promise = refreshStanding(competitionId)
                } else {
                    promise = database
                        .ref(`cachedData/standings/${competitionId}/data`)
                        .once('value')
                        .then((snapshot) => snapshot.val());
                }
                return promise;
            })
            .then((standing) => {
                dispatch(updateStanding(competitionId, standing));
            });
    }
}