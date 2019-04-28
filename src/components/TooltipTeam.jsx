import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import store from '../store/configureStore';
import Tooltip from './Tooltip'
import Image from './Image';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

const getTeam = (teamId) => {
	const teams = store.getState().teams.models;
	const competitionIds = Object.keys(teams);

	for (let i = 0; i < competitionIds.length; i += 1) {
		const competitionId = competitionIds[i];

		if (has(teams[competitionId], teamId)) {
			return teams[competitionId][teamId];
		}
	}
	return null;
}

class TooltipTeam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team: getTeam(this.props.id),
		};
	}

	renderTeamInfo = (team) => (
		<React.Fragment>
			<div className='tooltip-team__image'>{
				<Image alt='team logo' src={team.crestUrl} defaultImage={defaultLogo} />
			}
			</div>
			<div className='tooltip-team__text'>
				<div>
					<span className='bold'>Code:</span>{' '}
					{team.tla}
				</div>
				<div>
					<span className='bold'>Area:</span>{' '}
					{team.area.name}
				</div>
				<div>
					<span className='bold'>Club color:</span>{' '}
					{team.clubColors}
				</div>
				<div>
					<span className='bold'>Founded:</span>{' '}
					{team.founded}
				</div>
				<div>
					<span className='bold'>Venue:</span>{' '}
					{team.venue}
				</div>
				<div>
					<span className='bold'>Email:</span>{' '}
					<button
						type='button'
						className='button button--link tooltip-team__email'
						onClick={() => window.open(`mailto:${team.email}`)}>{team.email}</button>
				</div>
				<div>
					<span className='bold'>Address:</span>{' '}
					{team.address}
				</div>
				<div>
					<span className='bold'>Website:</span>{' '}
					<a href={team.website} target='_blank' rel='noreferrer noopener'>{team.website}</a>
				</div>
			</div>
		</React.Fragment>
	)

	onMouseEnter = () => {
		if (!this.state.team) {
			this.setState(() => ({ team: getTeam(this.props.id) }))
		}
	}

	render() {
		const { children, className } = this.props;
		const { team } = this.state;

		return (
			<Tooltip
				className={className}
				onMouseEnter={this.onMouseEnter}
				component={team ? () => this.renderTeamInfo(team) : 'span'}>{
					children
				}
			</Tooltip>
		);
	}
}

TooltipTeam.propTypes = {
	id: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

TooltipTeam.defaultProps = {
	className: '',
};

export default TooltipTeam;
