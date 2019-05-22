import firestore from '../firebase/firebase';
import getAge from '../utilities/getAge';

const fetchTeamPending = () => ({
	type: 'FETCH_TEAM_PENDING',
});

const fetchTeamCompleted = (team) => ({
	type: 'FETCH_TEAM_COMPLETED',
	payload: {
		team,
	},
});

const computeAge = (player) => {
	const playerWithAge = player;
	playerWithAge.age = getAge(player.birthday);
	return playerWithAge;
}

const startFetchTeam = (id) =>
	(dispatch) => {
		dispatch(fetchTeamPending());

		return firestore.doc(`teams/${id}`).get()
			.then((doc) => {
				const team = doc.data();

				team.squad = team.squad.map((player) => computeAge(player));
				dispatch(fetchTeamCompleted(team));
			});
	}

export default startFetchTeam;