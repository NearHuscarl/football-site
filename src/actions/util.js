import has from 'lodash/has';
import moment from 'moment';
import firestore from '../firebase/firebase';
import settings from '../settings';
import Log from '../utilities/log';

// Randomize expired value. the smaller timeLeft value is, the higher chance
// expired value is true. It will prevent multiple API requests at the
// same times if many data are expired. 
const isExpired = (timeLeft, cacheTime) => {
	if (timeLeft > 0) {
		return false;
	} {
		const rate = Math.abs(timeLeft / cacheTime) / 2;
		return Math.random() < rate;
	}
}

/**
 * 
 * @param {firebase.firestore.Query} query 
 */
export const get = (query, callback = null) =>
	query.get().then((querySnapshot) => {
		const results = [];
		querySnapshot.forEach((doc) => {
			const item = doc.data();

			if (callback) {
				callback(item);
			}
			results.push(item);
		});
		return results;
	})

export const updateCacheTime = (type, identifier = '') => {
	const payload = { lastUpdated: moment().valueOf() };

	if (identifier.length === 0) {
		firestore.doc(`cacheTime/${type}`).set(payload);
	} else {
		firestore.doc(`cacheTime/${type}/id/${identifier}`).set(payload);
	}
}

const getCacheTime = (type, identifier = '') => {
	const getLastUpdatedValue = () => (doc) => {
		if (doc.exists) {
			return doc.data().lastUpdated;
		}
		return 0;
	}

	if (identifier.length === 0) {
		return firestore.doc(`cacheTime/${type}`).get()
			.then(getLastUpdatedValue());
	}
	return firestore.doc(`cacheTime/${type}/id/${identifier}`).get()
		.then(getLastUpdatedValue());
}

export const checkCacheTime = (type, identifier = '') =>
	getCacheTime(type, identifier).then((lastUpdated) => {
		const now = moment();
		const cacheTimeUntilNow = moment.duration(now.diff(lastUpdated));
		const typeExist = has(settings.cacheTime, type);
		if (!typeExist) {
			Log.info(`'${type}' cache time not exists. Fall back to default cache time (${settings.cacheTime.default})`);
		}

		const cacheTime = settings.cacheTime[typeExist ? type : 'default'];
		const timeLeft = (cacheTime - cacheTimeUntilNow.asHours()).toFixed(2);
		const expired = isExpired(timeLeft, cacheTime);

		if (!expired) {
			Log.debug(`${timeLeft} hour(s) left before refreshing ${type}`);
		}
		return expired;
	});