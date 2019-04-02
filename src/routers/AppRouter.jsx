import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../pages/DashboardPage';
import NewsPage from '../pages/NewsPage';
import FixturesPage from '../pages/FixturesPage';
import TransferPage from '../pages/TransferPage';
import MatchesPage from '../pages/MatchesPage';
import NotFoundPage from '../pages/NotFoundPage';
import PageRoute from './PageRoute';

export const history = createHistory();

const AppRouter = () => (
	<Router history={history}>
		<div>
			<Switch>
				<PageRoute path="/" component={DashboardPage} exact/>
				<PageRoute path="/news" component={NewsPage} exact/>
				<PageRoute path="/fixtures" component={FixturesPage} exact/>
				<PageRoute path="/transfers" component={TransferPage} exact/>
				<PageRoute path="/matches" component={MatchesPage} exact/>
				<Route component={NotFoundPage} />
			</Switch>
		</div>
	</Router>
);

export default AppRouter;
