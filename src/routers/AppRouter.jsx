import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import NotFoundPage from '../pages/NotFoundPage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

// Need react-router-dom 4.4.0-beta.5 (yarn add -D react-router-dom@next)
// https://github.com/ReactTraining/react-router/issues/6420#issuecomment-435171740
const HomePage = lazy(() => import(/*
	webpackChunkName: "home",
  */ '../pages/HomePage'));
const NewsPage = lazy(() => import(/*
	webpackChunkName: "news",
	webpackPrefetch: true
	*/ '../pages/NewsPage'));
const SearchPage = lazy(() => import(/*
	webpackChunkName: "search",
	webpackPrefetch: true
	*/ '../pages/SearchPage'));
const FixturesPage = lazy(() => import(/*
	webpackChunkName: "fixture",
	webpackPrefetch: true
  */ '../pages/FixturesPage'));
const StandingPage = lazy(() => import(/*
	webpackChunkName: "standing",
	webpackPrefetch: true
  */ '../pages/StandingPage'));
const PlayersPage = lazy(() => import(/*
	webpackChunkName: "player",
	webpackPrefetch: true
  */ '../pages/PlayersPage'));

export const history = createBrowserHistory();

const AppRouter = () => (
	<Router history={history}>
		<Route path="/" component={Header} />
		<Suspense fallback={<div />}>
			<Switch>
				<Route path="/" component={HomePage} exact />
				<Route path="/news" component={NewsPage} exact />
				<Route path="/search" component={SearchPage} exact />
				<Route path="/fixtures" component={FixturesPage} exact />
				<Route path="/standings" component={StandingPage} />
				<Route path="/players" component={PlayersPage} exact />
				<Route component={NotFoundPage} />
			</Switch>
			<Footer />
		</Suspense>
	</Router>
);

export default AppRouter;