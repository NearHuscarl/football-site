import moment from 'moment';
import database from '../firebase/firebase';
import settings from '../settings';

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
            const cacheTime = moment.duration(now.diff(lastUpdated));
            let cacheTimeType = dataType.replace(/[^a-z]/gi, '');
            if (!settings.cacheTime.hasOwnProperty(cacheTimeType)) {
                cacheTimeType = 'default';
                console.log(`Something maybe wrong. Fall back to default cache time (${settings.cacheTime.default})`);
            }
            
            console.log(`${(settings.cacheTime[cacheTimeType] - cacheTime.asHours()).toFixed(2)} hour(s) left before refreshing ${dataType}`);
            let result = {
                meta,
                expired: false,
            };

            if (cacheTime.asHours() > settings.cacheTime[cacheTimeType]) {
                result.expired = true;
            } else {
                result.expired = false;
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