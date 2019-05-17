import React from 'react';
import PropTypes from 'prop-types';
import Image from './Image';
import Position from './Position';
import TooltipTeam from './TooltipTeam';
import { scorerPropTypes } from '../utilities/footballProptypes';
import defaultAvatar from '../../public/images/Default_Player_Avatar.png';
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
		<div className='ml-s'>
			<div>
				<span className='t-l bold'>{scorer.shortName || scorer.name}</span>{' '}
				<span className='t-s'>
					{Array.isArray(scorer.position) ?
						<Position>{scorer.position}</Position> :
						scorer.position
					}
				</span>
			</div>
			<div>
				<span className='bold'>Team:</span>{' '}
				<TooltipTeam id={scorer.team.id}>
					{scorer.team.name}
				</TooltipTeam>
			</div>
			<div>
				<span className='bold'>Goals:</span>{' '}
				{scorer.numberOfGoals}
			</div>
		</div>
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