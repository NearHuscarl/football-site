import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import store from '../store/configureStore';
import Tooltip from './Tooltip'
import Image from './Image';
import FakeLink from './FakeLink';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { historyPropTypes } from '../utilities/routerProptypes'

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
					{team.areaName}
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
						className='button button--link-red'
						onClick={() => window.open(`mailto:${team.contact.email}`)}>{team.contact.email}</button>
				</div>
				<div>
					<span className='bold'>Address:</span>{' '}
					{team.contact.address}
				</div>
				<div>
					<span className='bold'>Website:</span>{' '}
					<a href={team.contact.website} target='_blank' rel='noreferrer noopener'>{team.contact.website}</a>
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
		const { children, className, id } = this.props;
		const { team } = this.state;

		return (
			<Tooltip
				className={className}
				onMouseEnter={this.onMouseEnter}
				component={team ? () => this.renderTeamInfo(team) : 'span'}>
				<FakeLink to={`team/${id}`}>
					{children}
				</FakeLink>
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

// This component need a history props to navigate to other routes
// because it will be placed outside of the Route component which
// make routing via Link component not working
// Usecase: CustomRenderer component in ag-grid will be appended to the dom
// (outside of the Route component)
export class TooltipTeamHistory extends TooltipTeam {
	onClick = () => {
		const { team } = this.state;
		const { history } = this.props;

		history.push(`team/${team.id}`)
	}

	render() {
		const { children, className } = this.props;
		const { team } = this.state;

		return (
			<Tooltip
				className={className}
				onMouseEnter={this.onMouseEnter}
				component={team ? () => this.renderTeamInfo(team) : 'span'}>
				<span
					tabIndex={-1}
					role='button'
					onKeyPress={this.onClick}
					onClick={this.onClick}>
					{children}
				</span>
			</Tooltip>
		);
	}
}

TooltipTeamHistory.propTypes = {
	id: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	history: historyPropTypes.isRequired,
};
