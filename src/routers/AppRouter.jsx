import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../pages/DashboardPage';
import NewsPage from '../pages/NewsPage';
import FixturesPage from '../pages/FixturesPage';
import TransferPage from '../pages/TransferPage';
import MatchesPage from '../pages/MatchesPage';
import NotFoundPage from '../pages/NotFoundPage';
import Header from '../components/Header';

export const history = createHistory();

const AppRouter = (props) => (
	<Router history={history}>
		<div>
			<Header history={history} />
			<Switch>
				<Route path="/" component={DashboardPage} exact />
				<Route path="/news" component={NewsPage} exact />
				<Route path="/fixtures" component={FixturesPage} exact />
				<Route path="/transfers" component={TransferPage} exact />
				<Route path="/matches" component={MatchesPage} exact />
				<Route component={NotFoundPage} />
			</Switch>
		</div>
	</Router>
);

export default AppRouter;
