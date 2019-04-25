import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import '../styles/components/_carousel.scss';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import take from 'lodash/take';
import shuffle from 'lodash/shuffle';
import moment from 'moment';
import { competitions } from '../settings';
import Image from './Image';
import Loader from './Loader';
import defaultLogo from '../../public/images/Default_Team_Logo.png';

class FixtureTile extends React.Component {
	constructor(props) {
		super(props);

		this.competitionIds = [
			competitions.premierLeague,
			competitions.primeraDivision,
			competitions.bundesliga,
			competitions.serieA,
		];
	}

	isDataReady = () => {
		const { fixtures, teams } = this.props;

		if (isEmpty(fixtures) || isEmpty(teams)) {
			return false;
		}

		return this.competitionIds.every((competitionId) => {
			if (!has(teams, competitionId)) {
				return false;
			}
			if (!has(fixtures, competitionId)) {
				return false;
			}
			return true;
		});
	}

	renderFixture = (fixture) => {
		const { teams } = this.props;
		const competitionId = fixture.competition.id;
		const homeId = fixture.homeTeam.id;
		const awayId = fixture.awayTeam.id;
		const homeTeam = teams[competitionId][homeId];
		const awayTeam = teams[competitionId][awayId];
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
						<span className='fixture__team-score'>V</span>
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
		const randomFixtures = take(shuffle(fixtures[competitionId]), 5);
		let competitionName = '';
		let matchday = '';

		if (randomFixtures.length > 0) {
			competitionName = randomFixtures[0].competition.name;
			matchday = randomFixtures[0].season.currentMatchday;
		}

		return (
			<div className='tile-imageitem' key={competitionId}>
				<div className='fixture-title'>
					{`${competitionName} | Matchday ${matchday}`}
				</div>
				{randomFixtures.map((fixture) => this.renderFixture(fixture))}
			</div>
		);
	}

	render() {
		return (this.isDataReady() ?
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
					showStatus={false}>
					{
						this.competitionIds
							.map((competitionId) => this.renderFixtures(competitionId))
					}
				</Carousel>
			</div>
			:
			<Loader />
		);
	}
}

const getMatchesByCompetition = (matchData) => {
	if (isEmpty(matchData)) {
		return {};
	}
	const result = {};

	Object.keys(matchData).forEach((date) => {
		matchData[date].forEach((match) => {
			const competitionId = match.competition.id;

			if (!has(result, competitionId)) {
				result[competitionId] = [];
			}
			result[competitionId].push(match);
		});
	});

	return result;
}

FixtureTile.propTypes = {
	fixtures: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
	teams: PropTypes.objectOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
	fixtures: getMatchesByCompetition(state.matches.models),
	teams: state.teams.models,
})

export default connect(
	mapStateToProps,
	undefined,
)(FixtureTile);