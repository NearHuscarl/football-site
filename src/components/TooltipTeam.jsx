import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import store from '../store/configureStore';
import Tooltip from './Tooltip'
import Image from './Image';
import Rating from './Rating';
import StarRating from './StarRating';
import FakeLink from './FakeLink';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import withHistory from '../hoc/TooltipTeam';

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
			<div className='container-col center mr-s'>
				<div className='mb-s'>{
					<Image className='logo' alt='team logo' src={team.crestUrl} defaultImage={defaultLogo} />
				}
				</div>
				<div>
					<Rating>{team.attack}</Rating>{' '}
					<Rating>{team.midfield}</Rating>{' '}
					<Rating>{team.defence}</Rating>{' '}
				</div>
			</div>
			<div>
				<div>
					<span className='bold'>Domestic Prestige:</span>{' '}
					<StarRating score={team.domesticPrestige} maxScore={10} />
				</div>
				<div>
					<span className='bold'>International Prestige:</span>{' '}
					<StarRating score={team.internationalPrestige} maxScore={10} />
				</div>
				<div>
					<span className='bold'>Overall Rating:</span>{' '}<Rating>{team.overall}</Rating>
				</div>
				<div>
					<span className='bold'>Area:</span>{' '}{team.area.name}
				</div>
				<div>
					<span className='bold'>Stadium:</span>{' '}{team.venue}
				</div>
				<div>
					<span className='bold'>Email:</span>{' '}
					<button
						type='button'
						className='button button--link-red'
						onClick={() => window.open(`mailto:${team.contact.email}`)}>{team.contact.email}</button>
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
				<FakeLink to={`/team/${id}`}>
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
export const TooltipTeamHistory = withHistory(TooltipTeam);