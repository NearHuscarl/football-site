/* eslint react/jsx-filename-extension: off */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import store from './store/configureStore';
import setupStore from './store/setupStore';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
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
// import moment from 'moment';
// import database from './firebase/firebase';

// store.dispatch(startFetchPlayerFromTeam(64));

// FirebaseUtil.getAllTeamNameHashes().then((teamNames) => {
// 	console.log(teamNames);
// });
// FirebaseUtil.logArticles('2019-05-01', '2019-06-01');

// import startSearchMatches from './actions/matchResults';
// store.dispatch(startSearchMatches());