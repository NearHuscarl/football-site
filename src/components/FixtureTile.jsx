import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import take from 'lodash/take';
import moment from 'moment';
import { competitionIds } from '../settings';
import { history } from '../routers/AppRouter';
import Image from './Image';
import Loader from './Loader';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { matchPropTypes } from '../utilities/footballProptypes';

class FixtureTile extends React.Component {
	constructor(props) {
		super(props);

		this.competitionIds = [
			competitionIds.premierLeague,
			competitionIds.primeraDivision,
			competitionIds.bundesliga,
			competitionIds.serieA,
			competitionIds.championLeague,
		];
	}

	isDataReady = () => {
		const { fixtures } = this.props;

		if (isEmpty(fixtures)) {
			return false;
		}

		return this.competitionIds.some((competitionId) => has(fixtures, competitionId));
	}

	renderFixture = (fixture) => {
		const { homeTeam, awayTeam } = fixture;
		const date = moment.utc(fixture.utcDate).format('HH:mm ddd DD MMM');

		return (
			<div className='fixture-body' key={fixture.id}>
				<div className='fixture__logo' >
					<Image alt='home team' src={homeTeam.crestUrl} defaultImage={defaultLogo} />
				</div>
				<div className='fixture__info'>
					<div className='fixture__team'>
						<span className='fixture__team-name'>
							{homeTeam.shortName}
						</span>
						<span className='fixture__team-score'>-</span>
						<span className='fixture__team-name'>
							{awayTeam.shortName}
						</span>
					</div>
					<div className='fixture__date'>
						{date}
					</div>
				</div>
				<div className='fixture__logo' >
					<Image alt='away team' src={awayTeam.crestUrl} defaultImage={defaultLogo} />
				</div>
			</div>
		);
	}

	renderFixtures = (competitionId) => {
		const { fixtures } = this.props;
		const latestFixtures = take(fixtures[competitionId], 5); // matches are already sorted by utcDate (asc)
		const matchdays = [];
		const { competition } = latestFixtures[0];

		latestFixtures.forEach((fixture) => {
			const { matchday } = fixture;
			if (matchdays.indexOf(matchday) === -1) {
				matchdays.push(matchday);
			}
		});
		matchdays.sort();
		
		let headerText = competition.name;
		if (competition.id !== competitionIds.championLeague) {
			headerText += ' | Matchday ${matchdays.join('/')}'
		}

		return (
			<div className='tile-imageitem' key={competitionId}>
				<div className='fixture-title'>
					{headerText}
				</div>
				{latestFixtures.map((fixture) => this.renderFixture(fixture))}
			</div>
		);
	}

	render() {
		const fixtureCompeitions = Object.keys(this.props.fixtures).map((k) => Number(k));
		const { matchPending } = this.props;
		const isDataReady = this.isDataReady();

		if (isDataReady) {
			return (
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
						onClickItem={() => history.push('/fixtures')}>
						{
							intersection(fixtureCompeitions, this.competitionIds)
								.map((competitionId) => this.renderFixtures(competitionId))
						}
					</Carousel>
				</div>
			);
		}
		if (!isDataReady && !matchPending) {
			return (
				<div className='carousel-wrapper' style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
					No match available now
				</div>
			);
		}
		// if (!isDataReady && matchPending)
		return <Loader />;
	}
}

const getMatchesByCompetition = (matches) => {
	const matchesByCompetition = {};

	matches.forEach((match) => {
		const { competition } = match;

		if (!has(matchesByCompetition, competition.id)) {
			matchesByCompetition[competition.id] = [];
		}
		matchesByCompetition[competition.id].push(match);
	});

	return matchesByCompetition;
}

FixtureTile.propTypes = {
	fixtures: PropTypes.objectOf(PropTypes.arrayOf(matchPropTypes)).isRequired,
	matchPending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	fixtures: getMatchesByCompetition(state.matches.models),
	matchPending: state.matches.pending,
})

export default connect(
	mapStateToProps,
	undefined,
)(FixtureTile);