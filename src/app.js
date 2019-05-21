/* eslint react/jsx-filename-extension: off */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import store from './store/configureStore';
import setupStore from './store/setupStore';
import 'normalize.css/normalize.css';
import 'rc-menu/assets/index.css';
import './styles/styles.scss';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
// import firestore from './firebase/firebase';
// import { updateCacheTime, set, get } from './actions/util';
// import deburr from 'lodash/deburr';
// import checkUpdateTeams from './actions/players';

// checkUpdateTeams(true);

// FirebaseUtil.logArticles('2018-01-01', '2020-01-01');

// FirebaseUtil.getAllTeamNameHashes().then((teamNames) => {
// 	console.log(teamNames);
// });
