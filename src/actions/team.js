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
		let team = null;

		return firestore.collection('teams')
			.where('id', '==', id)
			.get().then((querySnapshot) => {
				const [doc] = querySnapshot.docs;
				team = doc.data();

				return get(firestore.collection(`teams/${doc.id}/squad`));
			}).then((squad) => {
				team.squad = squad.map((player) => computeAge(player));
				dispatch(fetchTeamCompleted(team));
			})
	}

export default startFetchTeam;