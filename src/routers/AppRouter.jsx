import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import HomePage from '../pages/HomePage';
import NewsPage from '../pages/NewsPage';
import FixturesPage from '../pages/FixturesPage';
import StandingPage from '../pages/StandingPage';
import PlayersPage from '../pages/PlayersPage';
import NotFoundPage from '../pages/NotFoundPage';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const history = createBrowserHistory();

const AppRouter = () => (
	<Router history={history}>
		<div>
			<Header history={history} />
			<Switch>
				<Route path="/" component={HomePage} exact />
				<Route path="/news" component={NewsPage} exact />
				<Route path="/fixtures" component={FixturesPage} exact />
				<Route path="/standings/:id" component={StandingPage} />
				<Route path="/players" component={PlayersPage} exact />
				<Route component={NotFoundPage} />
			</Switch>
			<Footer />
		</div>
	</Router>
);

export default AppRouter;
