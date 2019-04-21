import shuffle from 'lodash/shuffle';
import take from 'lodash/take';
import { startSetNews, setHeadlines } from '../actions/news';
import { startUpdateMatch } from '../actions/matches';
import { startUpdateTeams, updateTeam } from '../actions/teams';
import { startUpdateStanding } from '../actions/standings';
import { competitions } from '../settings';
import teamLogos from '../utilities/teamLogos';

const competitionIds = [
    competitions.premierLeague,
    competitions.primeraDivision,
    competitions.bundesliga,
    competitions.serieA,
];

const setupStore = (store) => {
    store.dispatch(startSetNews())
        .then(() => {
            const { articles, meta } = store.getState().news;
            const headlines = take(shuffle(articles[meta.currentIndex]), 4);
            store.dispatch(setHeadlines(headlines));
        });

    competitionIds.forEach((competitionId) => {
        store.dispatch(startUpdateStanding(competitionId));
    });
    
    Object.values(competitions).forEach((competitionId) => {
        store.dispatch(startUpdateTeams(competitionId)).then(() => {
            // Update obsolute logo urls
            const { teams } = store.getState();
            Object.keys(teams[competitionId]).forEach((teamId) => {
                if (teamLogos.hasOwnProperty(teamId)) {
                    const team = teams[competitionId][teamId];
                    team.crestUrl = teamLogos[teamId];
                    store.dispatch(updateTeam(competitionId, team));
                }
            });
        });
    });
    
    store.dispatch(startUpdateMatch());
}

export default setupStore;