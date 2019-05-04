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

// const flattenArticleData = (article) => {
// 	const result = article;
	
// 	result.sourceId = article.source.id;
// 	result.sourceName = article.source.name;
	
// 	delete result.source;
// 	return result;
// }

// database.ref('articles').remove().then(() => {
// 	const ids = [21,22,23,24];

// 	ids.reduce((prev, id) => {
// 		return prev.then(() => {
// 			return database.ref('cachedData/news/data/' + id + '/articles').once('value').then((snapshot) => {
// 				snapshot.forEach((child) => {
// 					const article = flattenArticleData(child.val());
// 					database.ref('articles').push().setWithPriority(article, 0 - moment(article.publishedAt).valueOf());
// 				});
// 			});
// 		});
// 	}, Promise.resolve());
// });


// FirebaseUtil.getAllTeamNameHashes().then((teamNames) => {
// 	console.log(teamNames);
// });
// FirebaseUtil.logArticles('2019-05-01', '2019-06-01');
// FirebaseUtil.logMatchDates('2019-04-01', '2019-06-01');
// FirebaseUtil.logMatches('2019-04-01', '2019-06-01');

// import startSearchMatches from './actions/matchResults';
// store.dispatch(startSearchMatches());