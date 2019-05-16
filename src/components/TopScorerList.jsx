import React from 'react';
import PropTypes from 'prop-types';
import Image from './Image';
import TooltipTeam from './TooltipTeam';
import { scorerPropTypes } from '../utilities/footballProptypes';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';
import Position from './Position';
import withPlayerModal from '../hoc/PlayerList';

const renderScorerItem = (scorer, onClickPlayer) => (
	<div className='list-item-base vertical-align'
		key={scorer.name} >
		<Image
			className='a'
			width={80}
			height={80}
			alt='avatar'
			src={scorer.avatar || defaultAvatar}
			onClick={() => onClickPlayer(scorer)}
			onKeyPress={() => onClickPlayer(scorer)}
			defaultImage={defaultAvatar} />
		<ul className='ml-s'>
			<li>
				<span className='bold'>Name:</span>{' '}
				{scorer.shortName || scorer.name}
			</li>
			<li>
				<span className='bold'>Position:</span>{' '}
				{Array.isArray(scorer.position) ?
					<Position>{scorer.position}</Position> :
					scorer.position
				}
			</li>
			<li>
				<span className='bold'>Team:</span>{' '}
				<TooltipTeam id={scorer.team.id}>
					{scorer.team.name}
				</TooltipTeam>
			</li>
			<li>
				<span className='bold'>Goals:</span>{' '}
				{scorer.numberOfGoals}
			</li>
		</ul>
	</div>
)

const TopScorerList = (props) => {
	const { scorers, onClickPlayer } = props;

	return (
		<div className='top-scorer'>
			<div className='header'>
				Top Scorers
			</div>
			<div className='top-scorer-body'>
				<div className='top-scorer-list'>{
					scorers.map((scorer) => renderScorerItem(scorer, onClickPlayer))
				}
				</div>
			</div>
		</div>
	);
}

export const TopScorerListMock = TooltipTeam;

TopScorerList.propTypes = {
	scorers: PropTypes.arrayOf(scorerPropTypes).isRequired,
	onClickPlayer: PropTypes.func.isRequired,
};

export default withPlayerModal(TopScorerList);