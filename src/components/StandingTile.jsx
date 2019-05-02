import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import has from 'lodash/has';
import { setStandingCompetitionFilter } from '../actions/standingFilters';
import { competitionIds } from '../settings';
import { history } from '../routers/AppRouter';
import StandingTableSmall from './StandingTableSmall';
import Loader from './Loader';

class StandingTile extends React.Component {
	constructor(props) {
		super(props);
		this.competitions = [
			competitionIds.premierLeague,
			competitionIds.primeraDivision,
			competitionIds.bundesliga,
			competitionIds.serieA,
		];
	}

	onClickStandingTable = (index) => {
		const competitionId = this.competitions[index];
		this.props.setStandingCompetitionFilter(competitionId);
		history.push('/standings');
	}

	// Avoid rerendering multiple table components when data are not ready
	isDataReady = () => {
		const { standings } = this.props;

		return this.competitions.every((competitionId) => {
			if (!has(standings, competitionId)) {
				return false;
			}
			return true;
		});
	}

	render() {
		const { competitions, props } = this;

		return (
			this.isDataReady() ?
				<div className='carousel-wrapper'>
					<Carousel
						width='34rem'
						useKeyboardArrows
						infiniteLoop
						autoPlay
						interval={5000}
						transitionTime={600}
						showIndicators={false}
						showThumbs={false}
						showStatus={false}
						onClickItem={this.onClickStandingTable}>
						{
							competitions.map((competitionId) => {
								const standing = props.standings[competitionId];
								return <StandingTableSmall
									className='tile-imageitem'
									key={competitionId}
									competitionId={competitionId}
									standing={standing.total}
									rowStyle={{ cursor: 'pointer' }} />
							})
						}
					</Carousel>
				</div>
				:
				<Loader />
		);
	}
}

export const MockStandingTile = StandingTile;

StandingTile.propTypes = {
	standings: PropTypes.objectOf(PropTypes.object).isRequired,
	setStandingCompetitionFilter: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	standings: state.standings.models,
})

const mapDispatchToProps = (dispatch) => ({
	setStandingCompetitionFilter: (competitionId) => dispatch(setStandingCompetitionFilter(competitionId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StandingTile);
