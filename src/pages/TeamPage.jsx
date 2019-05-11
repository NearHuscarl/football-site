import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import Image from '../components/Image';
import PageHeader from '../components/PageHeader';
import TeamDetail from '../components/TeamDetail';
import TeamKit from '../components/TeamKit';
import PlayerList from '../components/PlayerList';
import Loader from '../components/Loader';
import startFetchTeam from '../actions/team';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { teamDetailPropTypes } from '../utilities/footballProptypes';
import { matchPropTypes } from '../utilities/routerProptypes';

export class TeamPage extends React.Component {
	constructor(props) {
		super(props);
		const teamId = Number(this.props.match.params.id);
		this.props.startFetchTeam(teamId);
	}

	renderTeamInfo = () => {
		const { team } = this.props;

		return (
			<div className='container-between'>
				<aside className='side-bar'>
					<TeamDetail team={team} />
					<div className='sep' />
					<TeamKit kit={team.kit} />
				</aside>

				<div>
					<h2 className='mb-s'>Starting</h2>
					<PlayerList players={team.squad.starting} />
					<div className='sep-m' />

					<h2 className='mb-s'>Sub</h2>
					<PlayerList players={team.squad.sub} />
					<div className='sep-m' />

					<h2 className='mb-s'>Res</h2>
					<PlayerList players={team.squad.res} />
					<div className='sep-m' />

					<h2 className='mb-s'>On Loan</h2>
					<PlayerList players={team.squad.onLoan} />
				</div>
			</div>
		);
	}

	render() {
		const { pending, team } = this.props;
		const loading = (pending || isEmpty(team));

		return (
			<div>
				<PageHeader>{loading ?
					null
					:
					<div className='vertical-align'>
						<Image width={60} alt='team logo' src={team.crestUrl} defaultImage={defaultLogo} />
						<div className='ml-m'>
							<h1>{team.name}</h1>
							<div>
								<img className='flag' alt='country flag' src={team.countryFlag} />
								{team.areaName}
							</div>
						</div>
					</div>
				}
				</PageHeader>
				<div className='content-container'>{loading ?
					<Loader height='40vh' />
					:
					this.renderTeamInfo()
				}
				</div>
			</div>
		);
	}
}

TeamPage.propTypes = {
	startFetchTeam: PropTypes.func.isRequired,
	team: teamDetailPropTypes.isRequired,
	pending: PropTypes.bool.isRequired,
	match: matchPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
	team: state.team.models,
	pending: state.team.pending,
});

const mapDispatchToProps = (dispatch) => ({
	startFetchTeam: (teamId) => dispatch(startFetchTeam(teamId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TeamPage);