import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import get from 'lodash/get';
import Image from './Image';
import Position from './Position'
import StarRating from './StarRating'
import Rating from './Rating'
import { playerPropTypes } from '../utilities/footballProptypes';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

const getText = (obj, path) => get(obj, path, 'N/A')
const getNumber = (obj, path) => get(obj, path, 0)

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
				<Image className='mr-s' alt='player avatar' src={player.avatar || defaultAvatar} defaultImage={defaultAvatar} />
				<div className='modal__player-summary'>
					<h1>{player.shortName || player.name}</h1>
					<div>{player.name}</div>
					<div>
						{player.countryFlag &&
							<img alt='country flag' className='flag' src={player.countryFlag} />}
						<Position>{getText(player, 'position')}</Position>{' '}
						<span>
							<span className='bold'>Value:</span>{' '}
							{getText(player, 'value')}
						</span>{' '}
						<span>
							<span className='bold'>Wage:</span>{' '}
							{getText(player, 'wage')}
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
					{getText(player, 'age')}
				</div>
				<div>
					<span className='bold'>Height:</span>{' '}
					{getText(player, 'height')}
				</div>
				<div>
					<span className='bold'>Weight:</span>{' '}
					{getText(player, 'weight')}
				</div>
				<div>
					<span className='bold'>Preferred Foot:</span>{' '}
					{getText(player, 'stats.preferredFoot')}
				</div>
				<div>
					<span className='bold'>Work Rate:</span>{' '}
					{getText(player, 'stats.workRate')}
				</div>
				<div>
					<span className='bold'>Body Type:</span>{' '}
					{getText(player, 'stats.bodyType')}
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
					<Rating>{getNumber(player, 'overallRating')}</Rating>
				</div>
				<div>
					<span className='bold'>Potential:</span>{' '}
					<Rating>{getNumber(player, 'potential')}</Rating>
				</div>
				<div>
					<span className='bold'>Reputation:</span>{' '}
					<StarRating score={getNumber(player, 'stats.internationalReputation')} />
				</div>
				<div>
					<span className='bold'>Skill Moves:</span>{' '}
					<StarRating score={getNumber(player, 'stats.skillMoves')} />
				</div>
				<div>
					<span className='bold'>Weak Foot:</span>{' '}
					<StarRating score={getNumber(player, 'stats.weakFoot')} />
				</div>
				<div>
					<span className='bold'>Release Clause:</span>{' '}
					{getText(player, 'stats.releaseClause')}
				</div>
			</React.Fragment>
		);
	}

	renderTeamInfo = (isNationalTeam) => {
		const { player } = this.props;
		if (isNationalTeam && !player.nationalTeam) return null;
		const team = isNationalTeam ? getText(player, 'nationalTeam') : getText(player, 'team');
		if (team === 'N/A') return null;

		return (
			<React.Fragment>
				<div className='vertical-align'>
					<img width='24rem' height='24rem' alt='team logo'
						src={team.logo || defaultLogo} className='mr-s' />
					<h3>{isNationalTeam ? getText(team, 'country') : getText(team, 'name')}</h3>
				</div>
				<div>
					<span className='bold'>Position:</span>{' '}
					<Position>{getText(team, 'position')}</Position>
				</div>
				<div>
					<span className='bold'>Rating:</span>{' '}
					<Rating>{getNumber(team, 'rating')}</Rating>
				</div>
				<div>
					<span className='bold'>Shirt Number:</span>{' '}
					{getText(team, 'shirtNumber')}
				</div>
				{!isNationalTeam && (
					<React.Fragment>
						<div>
							<span className='bold'>Join Date:</span>{' '}
							{getText(team, 'joinDate')}
						</div>
						<div>
							<span className='bold'>Contact End at:</span>{' '}
							{getText(team, 'contractEndDate')}
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