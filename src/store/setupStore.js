import shuffle from 'lodash/shuffle';
import take from 'lodash/take';
import { startFetchArticles, setHeadlines } from '../actions/articles';
import startFetchMatches from '../actions/matches';
import startFetchCompetitions from '../actions/competitions';
import startFetchStanding from '../actions/standings';
import { competitionIds } from '../settings';

const topCompetitions = [
	competitionIds.premierLeague,
	competitionIds.primeraDivision,
	competitionIds.bundesliga,
	competitionIds.serieA,
];

const setupStore = (store) => {
	store.dispatch(startFetchCompetitions());

	store.dispatch(startFetchArticles())
		.then(() => {
			const articles = store.getState().articles.models;
			const headlines = take(shuffle(articles), 4);
			store.dispatch(setHeadlines(headlines));
		});

	topCompetitions.forEach((competitionId) => {
		store.dispatch(startFetchStanding(competitionId));
	});
	
	store.dispatch(startFetchMatches());
}

export default setupStore;