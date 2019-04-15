import moment from 'moment';
import database from '../firebase/firebase';
import settings from '../settings';
import Log from '../utilities/log';

// Randomize expired value. the smaller timeLeft value is, the higher chance
// expired value is true. It will prevent multiple API requests at the
// same times if many data are expired. 
const isExpired = (timeLeft, cacheTime) => {
    if (timeLeft > 0) {
        return false;
    } else {
        const rate = Math.abs(timeLeft / cacheTime) / 2;
        return Math.random() < rate;
    }
}

export const checkCacheTimeExpired = (dataType) => {
    let meta = {
        lastUpdated:  0,
    }

    return database
        .ref(`cachedData/${dataType}/meta`)
        .once('value')
        .then((snapshot) => {
            if (snapshot.val()) {
                meta = snapshot.val();
            }

            const now = moment();
            const lastUpdated = moment(meta.lastUpdated);
            const cacheTimeUntilNow = moment.duration(now.diff(lastUpdated));
            let cacheTimeType = dataType.replace(/[^a-z]/g, ''); // remove id number if there are any
            if (!settings.cacheTime.hasOwnProperty(cacheTimeType)) {
                Log.info(`'${cacheTimeType}' cache time not exists. Fall back to default cache time (${settings.cacheTime.default})`);
                cacheTimeType = 'default';
            }
            
            const cacheTime = settings.cacheTime[cacheTimeType];
            const timeLeft = (cacheTime - cacheTimeUntilNow.asHours()).toFixed(2);
            let result = {
                meta,
                expired: isExpired(timeLeft, cacheTime),
            };

            if (result.expired) {
                Log.warning(`start refreshing ${dataType}`);
            } else {
                Log.debug(`${timeLeft} hour(s) left before refreshing ${dataType}`);
            }
            return result;
        })
        .catch((err) => {
            console.log('[football-site err]:', err);
        });
}

export const updateCacheTime = (dataType, otherMetaInfo = {}) => {
    const meta = {
        lastUpdated: moment().valueOf(),
        ...otherMetaInfo,
    };

    return database
        .ref(`cachedData/${dataType}/meta`)
        .set(meta);
}