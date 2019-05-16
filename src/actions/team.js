import moment from 'moment';
import firestore from '../firebase/firebase';
import { get } from './util';

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
	playerWithAge.age = moment().diff(moment(player.birthday), 'years');
	return playerWithAge;
}

const startFetchTeam = (id) =>
	(dispatch) => {
		dispatch(fetchTeamPending());

		return Promise.all([
			firestore.doc(`teams/${id}`).get().then((doc) => doc.data()),
			get(firestore.collection(`teams/${id}/squad`))
		]).then((result) => {
			const [team, squad] = result;

			team.squad = squad.map((player) => computeAge(player));
			dispatch(fetchTeamCompleted(team));
		});
	}

export default startFetchTeam;