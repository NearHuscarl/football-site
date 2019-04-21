/* eslint react/jsx-filename-extension: off */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import store from './store/configureStore';
import setupStore from './store/setupStore';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

setupStore(store);

const jsx = (
	<Provider store={store}>
		<AppRouter />
	</Provider>
);

const renderApp = () => {
	ReactDOM.render(jsx, document.getElementById('app'));
}

renderApp();
// import FirebaseUtil from './firebase/firebaseUtil';
// FirebaseUtil.getAllTeamNameHashes().then((teamNames) => {
// 	console.log(teamNames);
// });