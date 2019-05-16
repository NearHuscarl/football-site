import FootballData from 'footballdata-api-v2';
import deburr from 'lodash/deburr'
import firestore from '../firebase/firebase';
import { checkCacheTime, updateCacheTime, get } from './util';
import Log from '../utilities/log';

export const fetchTopScorersPending = () => ({
	type: 'FETCH_TOP_SCORERS_PENDING',
});

const fetchTopScorersCompleted = (competitionId, scorers) => ({
	type: 'FETCH_TOP_SCORERS_COMPLETED',
	payload: {
		competitionId,
		scorers,
	},
});


const compareName = (name1, name2) => {
	if (name1 === name2) return true;

	const pieces1 = name1.split(' ');
	const pieces2 = name2.split(' ');
	
	pieces1.forEach((part) => {
		if (pieces2.indexOf(part) !== -1) {
			pieces2.splice(pieces2.indexOf(part));
		}
	});

	return pieces2.length === 0;
}

const comparePlayer = (fdPlayer, sofifaPlayer) => {
	if (fdPlayer.shirtNumber === sofifaPlayer.team.shirtNumber
		&& fdPlayer.nationality === sofifaPlayer.country
		&& fdPlayer.dateOfBirth === sofifaPlayer.birthday) {
		return true;
	}

	const fdPlayerName = deburr(fdPlayer.name);
	const sofifaPlayerName = deburr(sofifaPlayer.name);
	if (fdPlayerName === deburr(sofifaPlayer.shortName)
		|| compareName(deburr(fdPlayer.firstName), sofifaPlayerName)
		|| compareName(fdPlayerName, sofifaPlayerName)
		|| compareName(sofifaPlayerName, fdPlayerName)) {
		return true;
	}

	return false;
}

const getPlayerDetails = async (scorers) => {
	const topScorerTeams = {};
	const results = [];
	const notFound = [];

	await scorers.reduce((prev, scorer) =>
		prev.then(async () => {
			const scorerTeamId = scorer.team.id;

			if (!topScorerTeams[scorerTeamId]) {
				const team = await get(firestore.collection(`teams/${scorerTeamId}/squad`))
				topScorerTeams[scorerTeamId] = team;
			}

			const squad = topScorerTeams[scorerTeamId];

			squad.some((player, index) => {
				const sofifaPlayer = player;
				const fdPlayer = scorer.player;

				if (comparePlayer(fdPlayer, sofifaPlayer)) {
					results.push({
						...sofifaPlayer,
						numberOfGoals: scorer.numberOfGoals
					});
					return true;
				}

				if (index === squad.length - 1) {
					results.push({
						name: fdPlayer.name,
						birthday: fdPlayer.dateOfBirth,
						country: fdPlayer.nationality,
						position: fdPlayer.position,
						numberOfGoals: scorer.numberOfGoals,
						team: scorer.team,
					});
					notFound.push(scorer);
				}

				return false;
			});

		}), Promise.resolve());

	Log.debug('top scorers detail not found', notFound);
	return results;
}

const flattenTopScorersData = async (topScorers) => {
	const result = topScorers;
	
	result.area = topScorers.competition.area;
	result.competition = { id: topScorers.competition.id, name: topScorers.competition.name };
	result.scorers = await getPlayerDetails(topScorers.scorers);
	
	delete result.season.winner;
	delete result.count;
	delete result.filters;
	
	return result;
}

const refreshTopScorer = (competitionId) => {
	const footballData = new FootballData(process.env.FOOTBALL_DATA_API_KEY);

	Log.warning(`start getting top scorers: competitionId=${competitionId}`);
	return footballData.getScorersFromCompetition({
		competitionId,
	}).then((data) => {
		return flattenTopScorersData(data);
	}).then((topScorers) => {
		firestore.doc(`topScorers/${competitionId}`)
			.set(topScorers)
			.then(() => updateCacheTime('topScorers', competitionId));
		return topScorers;
	}).catch((err) => {
		Log.error(`refreshTopScorer: ${err}`);
	});
}

const startFetchTopScorers = (competitionId) =>
	(dispatch) => {
		dispatch(fetchTopScorersPending());

		return checkCacheTime('topScorers', competitionId)
			.then((expired) => {
				if (expired) {
					return refreshTopScorer(competitionId)
				}
				return firestore
					.doc(`topScorers/${competitionId}`)
					.get()
					.then((doc) => doc.data());
			})
			.then((topScorers) => {
				dispatch(fetchTopScorersCompleted(competitionId, topScorers));
			});
	}

export default startFetchTopScorers;