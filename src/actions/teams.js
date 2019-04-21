import database from '../firebase/firebase';
import FootballData from 'footballdata-api-v2';
import { checkCacheTimeExpired, updateCacheTime } from './util';
import Log from '../utilities/log'

export const updateTeam = (competitionId, team) => ({
    type: 'UPDATE_SPECIFIC_TEAM',
    competitionId,
    team,
});

const updateTeams = (competitionId, teams) => ({
    type: 'UPDATE_TEAMS',
    competitionId,
    teams,
});

const refreshTeam = (competitionId) => {
    let teamData = {};
    const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

    Log.warning(`start getting teams: competitionId=${competitionId}`);
    return footballData.getTeamsFromCompetition({
        id: competitionId,
    })
    .then((data) => {
        updateCacheTime(`teams/${competitionId}`);
        
        const { teams } = data;
        teams.forEach((team) => {
            teamData[team.id] = team;
        });

        return database
            .ref(`cachedData/teams/${competitionId}/data`)
            .set(teamData);
    })
    .then(() => {
        return teamData;
    })
    .catch((err) => {
        console.log('refreshTeam:', err);
        return teamData;
    });
}

export const startUpdateTeams = (competitionId) => {
    return (dispatch) => {
        return checkCacheTimeExpired(`teams/${competitionId}`)
            .then((result) => {
                const { expired } = result;
                let promise = Promise.resolve(null);

                if (expired) {
                    promise = refreshTeam(competitionId)
                } else {
                    promise = database
                        .ref(`cachedData/teams/${competitionId}/data`)
                        .once('value')
                        .then((snapshot) => snapshot.val());
                }
                return promise;
            })
            .then((teams) => {
                dispatch(updateTeams(competitionId, teams));
            });
    }
}