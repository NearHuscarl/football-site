import {
	firebase,
	googleAuthProvider,
	facebookAuthProvider,
	twitterAuthProvider,
	githubAuthProvider,
} from '../firebase/firebase';

export const login = (uid) => ({
	type: 'LOGIN',
	uid,
});

export const startLoginWithGoogle = () => () =>
	firebase.auth().signInWithPopup(googleAuthProvider);

export const startLoginWithFacebook = () => () =>
	firebase.auth().signInWithPopup(facebookAuthProvider);

export const startLoginWithTwitter = () => () =>
	firebase.auth().signInWithPopup(twitterAuthProvider);

export const startLoginWithGithub = () => () =>
	firebase.auth().signInWithPopup(githubAuthProvider);

export const logout = () => ({
	type: 'LOGOUT',
});

export const startLogout = () => () => firebase.auth().signOut();
