import React from 'react';
import PropTypes from 'prop-types';
import TooltipTeam from './TooltipTeam';

class TopScorerList extends React.Component {
	renderScorerItem = (scorer) => (
		<ul key={scorer.player.name} className='list-item-base'>
			<li>
				<span className='bold'>Name:</span>{' '}
				{scorer.player.name}
			</li>
			<li>
				<span className='bold'>Position:</span>{' '}
				{scorer.player.position}
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