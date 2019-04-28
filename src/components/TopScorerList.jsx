import React from 'react';
import PropTypes from 'prop-types';
import TooltipTeam from './TooltipTeam';

class TopScorerList extends React.Component {
	renderScorerItem = (scorer) => (
		<div key={scorer.player.name} className='top-scorer-item'>
			<div className='top-scorer-item__name'>
				<span className='bold'>Name:</span>{' '}
				{scorer.player.name}
			</div>
			<div className='top-scorer-item__info'>
				<span className='bold'>Position:</span>{' '}
				{scorer.player.position}
			</div>
			<div className='top-scorer-item__info'>
				<span className='bold'>Team:</span>{' '}
				<TooltipTeam id={scorer.team.id}>
					{scorer.team.name}
				</TooltipTeam>
			</div>
			<div className='top-scorer-item__info'>
				<span className='bold'>Goals:</span>{' '}
				{scorer.numberOfGoals}
			</div>
		</div>
	)

	render() {
		const { scorers } = this.props;

		return (
			<div className='top-scorer'>
				<div className='header'>
					Top Scorers
				</div>
				<div className='top-scorer-body'>
					<div className='top-scorer-list'>{
						scorers.map((scorer) => this.renderScorerItem(scorer))
					}
					</div>
				</div>
			</div>
		);
	}
}

TopScorerList.propTypes = {
	scorers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TopScorerList;