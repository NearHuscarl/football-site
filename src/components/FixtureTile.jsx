import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import take from 'lodash/take';
import moment from 'moment';
import { competitionIds } from '../settings';
import { history } from '../routers/AppRouter';
import Image from './Image';
import Loader from './Loader';
import defaultLogo from '../../public/images/Default_Team_Logo.png';
import { teamModelPropTypes, matchPropTypes } from '../utilities/footballProptypes';

class FixtureTile extends React.Component {
	constructor(props) {
		super(props);

		this.competitionIds = [
			competitionIds.premierLeague,
			competitionIds.primeraDivision,
			competitionIds.bundesliga,
			competitionIds.serieA,
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
		const { competitionId, homeTeamId, awayTeamId } = fixture;
		const homeTeam = teams[competitionId][homeTeamId];
		const awayTeam = teams[competitionId][awayTeamId];
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
		const { competitionName } = latestFixtures[0];

		latestFixtures.forEach((fixture) => {
			const { matchday } = fixture;
			if (matchdays.indexOf(matchday) === -1) {
				matchdays.push(matchday);
			}
		});
		matchdays.sort();

		return (
			<div className='tile-imageitem' key={competitionId}>
				<div className='fixture-title'>
					{`${competitionName} | Matchday ${matchdays.join('/')}`}
				</div>
				{latestFixtures.map((fixture) => this.renderFixture(fixture))}
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
					showStatus={false}
					onClickItem={() => history.push('/fixtures')}>
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

const getMatchesByCompetition = (matches) => {
	const matchesByCompetition = {};

	matches.forEach((match) => {
		const { competitionId } = match;

		if (!has(matchesByCompetition, competitionId)) {
			matchesByCompetition[competitionId] = [];
		}
		matchesByCompetition[competitionId].push(match);
	});

	return matchesByCompetition;
}

FixtureTile.propTypes = {
	fixtures: PropTypes.objectOf(PropTypes.arrayOf(matchPropTypes)).isRequired,
	teams: teamModelPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
	fixtures: getMatchesByCompetition(state.matches.models),
	teams: state.teams.models,
})

export default connect(
	mapStateToProps,
	undefined,
)(FixtureTile);