import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // eslint-disable-line import/no-extraneous-dependencies
import newsReducer from '../reducers/news';
import standingsReducer from '../reducers/standings';
import matchesReducer from '../reducers/matches';
import teamsReducer from '../reducers/teams';
import newsFiltersReducer from '../reducers/newsFilters';
import newsResultsReducer from '../reducers/newsResults';
import matchFiltersReducer from '../reducers/matchFilters';
import matchResultsReducer from '../reducers/matchResults';
import standingFiltersReducer from '../reducers/standingFilters';
import standingResultReducer from '../reducers/standingResult';
import topScorersReducer from '../reducers/topScorers';

const store = createStore(
	combineReducers({
		news: newsReducer,
		standings: standingsReducer,
		matches: matchesReducer,
		teams: teamsReducer,
		newsFilters: newsFiltersReducer,
		newsResults: newsResultsReducer,
		matchFilters: matchFiltersReducer,
		matchResults: matchResultsReducer,
		standingFilters: standingFiltersReducer,
		standingResult: standingResultReducer,
		topScorers: topScorersReducer,
	}),
	composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
