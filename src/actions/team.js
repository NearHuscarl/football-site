import lowerFirst from 'lodash/lowerFirst'
import moment from 'moment';
import database from '../firebase/firebase';
import { filterRef } from './util';

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
		let teamResult;
		const squad = { starting: [], sub: [], res: [], onLoan: [] };

		return filterRef(database.ref('teams'), 'id', { equalTo: id })
			.then((result) => {
				const [team] = result;
				teamResult = team;
				return Promise.all(team.squad.map((player) => database
					.ref('players')
					.orderByChild('id')
					.equalTo(player.id)
					.once('value').then((snapshot) => {
						snapshot.forEach((childSnapshot) => {
							const playerDetail = computeAge(childSnapshot.val());
							squad[lowerFirst(player.role)].push(playerDetail);
						});
					})));
			})
			.then(() => dispatch(fetchTeamCompleted({ ...teamResult, squad })));
	}

export default startFetchTeam;