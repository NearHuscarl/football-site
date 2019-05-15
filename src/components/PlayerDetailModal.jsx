import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Image from './Image';
import Position from './Position'
import StarRating from './StarRating'
import Rating from './Rating'
import { playerPropTypes } from '../utilities/footballProptypes';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';

class PlayerDetailModal extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.isOpen !== nextProps.isOpen) {
			const { className } = document.getElementById('app');
			if (nextProps.isOpen) {
				document.getElementById('app').className = className + ' blur';
			} else {
				document.getElementById('app').className = className.replace(' blur', '');
			}

			return true;
		}

		return false;
	}

	renderSummary = () => {
		const { player } = this.props;

		return (
			<div className='container'>
				<Image className='mr-s' alt='player avatar' src={player.avatar} defaultImage={defaultAvatar} />
				<div className='modal__player-summary'>
					<h1>{player.shortName}</h1>
					<div>{player.name}</div>
					<div>
						<img alt='country flag' className='flag' src={player.countryFlag} />
						<Position>{player.position}</Position>{' '}
						<span>
							<span className='bold'>Value:</span>{' '}
							{player.value}
						</span>{' '}
						<span>
							<span className='bold'>Wage:</span>{' '}
							{player.wage}
						</span>
					</div>
				</div>
			</div>
		);
	}

	renderInfo = () => {
		const { player } = this.props;
		return (
			<React.Fragment>
				<div>
					<span className='bold'>Age:</span>{' '}
					{player.age}
				</div>
				<div>
					<span className='bold'>Height:</span>{' '}
					{player.height}
				</div>
				<div>
					<span className='bold'>Weight:</span>{' '}
					{player.weight}
				</div>
				<div>
					<span className='bold'>Preferred Foot:</span>{' '}
					{player.stats.preferredFoot}
				</div>
				<div>
					<span className='bold'>Work Rate:</span>{' '}
					{player.stats.workRate}
				</div>
				<div>
					<span className='bold'>Body Type:</span>{' '}
					{player.stats.bodyType}
				</div>
			</React.Fragment>
		)
	}

	renderStats = () => {
		const { player } = this.props;
		return (
			<React.Fragment>
				<div>
					<span className='bold'>Overall Rating:</span>{' '}
					<Rating>{player.overallRating}</Rating>
				</div>
				<div>
					<span className='bold'>Potential:</span>{' '}
					<Rating>{player.potential}</Rating>
				</div>
				<div>
					<span className='bold'>Reputation:</span>{' '}
					<StarRating score={player.stats.internationalReputation} />
				</div>
				<div>
					<span className='bold'>Skill Moves:</span>{' '}
					<StarRating score={player.stats.skillMoves} />
				</div>
				<div>
					<span className='bold'>Weak Foot:</span>{' '}
					<StarRating score={player.stats.weakFoot} />
				</div>
				<div>
					<span className='bold'>Release Clause:</span>{' '}
					{player.stats.releaseClause}
				</div>
			</React.Fragment>
		);
	}

	renderTeamInfo = (isNationalTeam) => {
		const { player } = this.props;
		if (isNationalTeam && !player.nationalTeam) return null;
		const team = isNationalTeam ? player.nationalTeam : player.team;

		return (
			<React.Fragment>
				<div className='vertical-align'>
					<img alt='team logo' src={team.logo} className='mr-s' />
					<h3>{isNationalTeam ? team.country : team.name}</h3>
				</div>
				<div>
					<span className='bold'>Position:</span>{' '}
					<Position>{team.position}</Position>
				</div>
				<div>
					<span className='bold'>Rating:</span>{' '}
					<Rating>{team.rating}</Rating>
				</div>
				<div>
					<span className='bold'>Shirt Number:</span>{' '}
					{team.shirtNumber}
				</div>
				{!isNationalTeam && (
					<React.Fragment>
						<div>
							<span className='bold'>Join Date:</span>{' '}
							{team.joinDate}
						</div>
						<div>
							<span className='bold'>Contact End at:</span>{' '}
							{team.contractEndDate}
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}

	render() {
		const { isOpen, onRequestClose, player } = this.props;

		return (
			<Modal
				isOpen={isOpen}
				onRequestClose={onRequestClose}
				contentLabel="Confirm Delete"
				closeTimeoutMS={200}
				className="modal"
				ariaHideApp={false}>
				{player !== null &&
					<div>
						<div className='modal__statusbar'>
							<button type='button' className='btn-round' onClick={() => onRequestClose()} />
						</div>
						<div className='modal__body modal__player-container'>
							<div className='container-col'>
								{this.renderSummary()}
								<div className='container-between'>
									<div className='col col-2'>
										{this.renderInfo()}
									</div>
									<div className='col col-2'>
										{this.renderStats()}
									</div>
								</div>
								<div className='container-between'>
									<div className='col col-2'>
										{this.renderTeamInfo(false)}
									</div>
									<div className='col col-2'>
										{this.renderTeamInfo(true)}
									</div>
								</div>
							</div>
						</div>
					</div>
				}
			</Modal>
		);
	}
}

PlayerDetailModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	player: playerPropTypes,
};

PlayerDetailModal.defaultProps = {
	player: null,
}

export default PlayerDetailModal;