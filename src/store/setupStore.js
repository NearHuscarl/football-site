import shuffle from 'lodash/shuffle';
import take from 'lodash/take';
import { startFetchNews, setHeadlines } from '../actions/news';
import { startFetchMatch } from '../actions/matches';
import { startFetchTeams } from '../actions/teams';
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
	// Not needed now
	// store.dispatch(startFetchCompetitions());

	store.dispatch(startFetchNews())
		.then(() => {
			const { meta } = store.getState().news;
			const articles = store.getState().news.models;
			const headlines = take(shuffle(articles[meta.currentIndex]), 4);
			store.dispatch(setHeadlines(headlines));
		});

	topCompetitions.forEach((competitionId) => {
		store.dispatch(startFetchStanding(competitionId));
	});
	
	Object.values(competitionIds).forEach((competitionId) => {
		store.dispatch(startFetchTeams(competitionId));
	});

	store.dispatch(startFetchMatch());
}

export default setupStore;