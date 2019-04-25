import shuffle from 'lodash/shuffle';
import take from 'lodash/take';
import has from 'lodash/has';
import { startFetchNews, setHeadlines } from '../actions/news';
import { startFetchMatch } from '../actions/matches';
import { startFetchTeams, setTeamsAtCompetition } from '../actions/teams';
import startFetchStanding from '../actions/standings';
import { competitions } from '../settings';
import teamLogos from '../utilities/teamLogos';

const competitionIds = [
	competitions.premierLeague,
	competitions.primeraDivision,
	competitions.bundesliga,
	competitions.serieA,
];

const setupStore = (store) => {
	store.dispatch(startFetchNews())
		.then(() => {
			const { meta } = store.getState().news;
			const articles = store.getState().news.models;
			const headlines = take(shuffle(articles[meta.currentIndex]), 4);
			store.dispatch(setHeadlines(headlines));
		});

	competitionIds.forEach((competitionId) => {
		store.dispatch(startFetchStanding(competitionId));
	});

	Object.values(competitions).forEach((competitionId) => {
		store.dispatch(startFetchTeams(competitionId)).then(() => {
			// Update obsolute logo urls
			const teams = store.getState().teams.models[competitionId];
			Object.keys(teams).forEach((teamId) => {
				if (has(teamLogos, teamId)) {
					teams[teamId].crestUrl = teamLogos[teamId];
				}
			});
			store.dispatch(setTeamsAtCompetition(teams, competitionId));
		});
	});

	store.dispatch(startFetchMatch());
}

export default setupStore;