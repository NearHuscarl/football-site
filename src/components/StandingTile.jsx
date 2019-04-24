import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import has from 'lodash/has';
import { competitions } from '../settings';
import '../styles/components/_carousel.scss';
import { history } from '../routers/AppRouter';
import StandingTableSmall from './StandingTableSmall';
import Loader from './Loader';

class StandingTile extends React.Component {
	constructor(props) {
		super(props);
		this.competitionIds = [
			competitions.premierLeague,
			competitions.primeraDivision,
			competitions.bundesliga,
			competitions.serieA,
		];
	}

	onClickStandingTable = (index) => {
		const { competitionIds } = this;
		history.push(`/standings/${competitionIds[index]}`);
	}

	// Avoid rerendering multiple table components when data are not ready
	isDataReady = () => {
		const { standings } = this.props;

		return this.competitionIds.every((competitionId) => {
			if (!has(standings, competitionId)) {
				return false;
			}
			return true;
		});
	}

	render() {
		const { competitionIds, props } = this;

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
							competitionIds.map((competitionId) => {
								const standing = props.standings[competitionId];
								return <StandingTableSmall className='tile-imageitem' key={competitionId} standing={standing} />
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
};

const mapStateToProps = (state) => ({
	standings: state.standings,
})

export default connect(
	mapStateToProps,
	undefined,
)(StandingTile);
