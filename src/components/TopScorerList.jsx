import React from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';

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
			<div className='top-scorer-item__name'>
				<span className='bold'>Team:</span>{' '}
				{scorer.team.name}
			</div>
			<div className='top-scorer-item__name'>
				<span className='bold'>Goals:</span>{' '}
				{scorer.numberOfGoals}
			</div>
		</div>
	)

	render() {
		const { scorers } = this.props;

		return (
			<div className='top-scorer-list'>
				<div className='header'>
					Top Scorers
				</div>
				{
					take(scorers, 4).map((scorer) => this.renderScorerItem(scorer))
				}
			</div>
		);
	}
}

TopScorerList.propTypes = {
	scorers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TopScorerList;