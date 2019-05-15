import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
};

firebase.initializeApp(config);
firebase.firestore().enablePersistence()
	.catch((e) => {
		if (e.code === 'failed-precondition') {
			// Multiple tabs open, persistence can only be enabled
			// in one tab at a a time.
		} else if (e.code === 'unimplemented') {
			// The current browser does not support all of the
			// features required to enable persistence
		}
	});

const firestore = firebase.firestore();

export default firestore;
