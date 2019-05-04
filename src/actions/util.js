import has from 'lodash/has';
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
	} {
		const rate = Math.abs(timeLeft / cacheTime) / 2;
		return Math.random() < rate;
	}
}

/**
 * 
 * @param {firebase.database.Reference} ref 
 * @param {string} field 
 * @param {{
 * 	  startAt?: string | number | boolean,
 *    endAt?: string | number | boolean,
 *    equalTo?: string | number | boolean,
 *    limitToFirst?: number,
 *    limitToLast?: number,
 *  }} query 
 */
export const applyQueries = (ref, field, query) => {
	let dbQuery = ref.orderByChild(field);

	if (has(query, 'startAt')) {
		dbQuery = dbQuery.startAt(query.startAt);
	}
	if (has(query, 'endAt')) {
		dbQuery = dbQuery.endAt(query.endAt);
	}
	if (has(query, 'equalTo')) {
		dbQuery = dbQuery.equalTo(query.equalTo);
	}
	if (has(query, 'limitToFirst')) {
		dbQuery = dbQuery.limitToFirst(query.limitToFirst);
	}
	if (has(query, 'limitToLast')) {
		dbQuery = dbQuery.limitToLast(query.limitToLast);
	}

	return dbQuery;
}

/**
 *
 * @param {firebase.database.Reference} ref 
 * @param {string} field
 * @param {{
 * 	  startAt?: string | number | boolean,
 *    endAt?: string | number | boolean,
 *    equalTo?: string | number | boolean,
 *    limitToFirst?: number,
 *    limitToLast?: number,
 *  }} query
 *
 */
export const filterRef = (ref, field, query) => applyQueries(ref, field, query)
	.once('value')
	.then((snapshot) => {
		const results = [];
		snapshot.forEach((childSnapshot) => {
			results.push(childSnapshot.val());
		});
		return results;
	});

/**
 * 
 * @param {firebase.database.Reference} parentRef 
 * @param {string} field 
 * @param {{
 * 	  startAt?: string | number | boolean,
 *    endAt?: string | number | boolean,
 *    equalTo?: string | number | boolean,
 *    limitToFirst?: number,
 *    limitToLast?: number,
 *  }} query
 * @param {any} updateData 
 * @param {string | number} priority 
 * 
 */
export const updateChildRef = (parentRef, field, query, updateData, priority = undefined) =>
	applyQueries(parentRef, field, query)
		.once('value').then((snapshot) => {
			if (snapshot.val()) {
				snapshot.forEach((childSnapshot) => {
					childSnapshot.ref.set(updateData);
				});
			} else if (priority) {
				parentRef.push().setWithPriority(updateData, priority);
			} else {
				parentRef.push(updateData);
			}
		});

export const updateCacheTime = (type, identify = '') =>
	database.ref(`cacheTime/${type}/${identify}`).set(moment().valueOf());

export const checkCacheTime = (type, identify = '') =>
	database
		.ref(`cacheTime/${type}/${identify}`)
		.once('value')
		.then((snapshot) => {
			const lastUpdated = snapshot.val() || 0;
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
		})
		.catch((err) => {
			Log.error(`checkCacheTime: ${err}`);
		})
