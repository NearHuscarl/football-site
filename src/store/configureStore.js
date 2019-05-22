import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // eslint-disable-line import/no-extraneous-dependencies
import articleReducer from '../reducers/articles';
import standingsReducer from '../reducers/standings';
import matchesReducer from '../reducers/matches';
import teamReducer from '../reducers/team';
import articleFiltersReducer from '../reducers/articleFilters';
import articleResultsReducer from '../reducers/articleResults';
import matchFiltersReducer from '../reducers/matchFilters';
import matchResultsReducer from '../reducers/matchResults';
import standingFiltersReducer from '../reducers/standingFilters';
import standingResultReducer from '../reducers/standingResult';
import topScorersReducer from '../reducers/topScorers';
import playersReducer from '../reducers/players';
import playerFiltersReducer from '../reducers/playerFilters';
import competitionsReducer from '../reducers/competitions';
import tooltipReducer from '../reducers/tooltip';

const store = createStore(
	combineReducers({
		articles: articleReducer,
		standings: standingsReducer,
		matches: matchesReducer,
		team: teamReducer,
		articleFilters: articleFiltersReducer,
		articleResults: articleResultsReducer,
		matchFilters: matchFiltersReducer,
		matchResults: matchResultsReducer,
		standingFilters: standingFiltersReducer,
		standingResult: standingResultReducer,
		topScorers: topScorersReducer,
		players: playersReducer,
		playerFilters: playerFiltersReducer,
		competitions: competitionsReducer,
		tooltip: tooltipReducer,
	}),
	composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
