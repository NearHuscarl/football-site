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
import { competitionModelPropTypes, matchPropTypes } from '../utilities/footballProptypes';

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
		const { fixtures, competitions } = this.props;

		if (isEmpty(fixtures) || isEmpty(competitions)) {
			return false;
		}

		return this.competitionIds.every((competitionId) => has(competitions, competitionId))
			&& this.competitionIds.some((competitionId) => has(fixtures, competitionId));
	}

	renderFixture = (fixture) => {
		const { competitions } = this.props;
		const { competition, homeTeam, awayTeam } = fixture;
		const homeTeamDetail = competitions[competition.id].teams[homeTeam.id];
		const awayTeamDetail = competitions[competition.id].teams[awayTeam.id];
		const date = moment.utc(fixture.utcDate).format('HH:mm ddd DD MMM');

		return (
			<div className='fixture-body' key={fixture.id}>
				<div className='fixture__logo' >
					<Image alt='home team' src={homeTeamDetail.crestUrl} defaultImage={defaultLogo} />
				</div>
				<div className='fixture__info'>
					<div className='fixture__team'>
						<span className='fixture__team-name'>
							{homeTeamDetail.shortName}
						</span>
						<span className='fixture__team-score'>-</span>
						<span className='fixture__team-name'>
							{awayTeamDetail.shortName}
						</span>
					</div>
					<div className='fixture__date'>
						{date}
					</div>
				</div>
				<div className='fixture__logo' >
					<Image alt='away team' src={awayTeamDetail.crestUrl} defaultImage={defaultLogo} />
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

		return (
			<div className='tile-imageitem' key={competitionId}>
				<div className='fixture-title'>
					{`${competition.name} | Matchday ${matchdays.join('/')}`}
				</div>
				{latestFixtures.map((fixture) => this.renderFixture(fixture))}
			</div>
		);
	}

	render() {
		const fixtureCompeitions = Object.keys(this.props.fixtures).map((k) => Number(k));

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
						intersection(fixtureCompeitions, this.competitionIds)
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
	competitions: competitionModelPropTypes.isRequired,
};

const mapStateToProps = (state) => ({
	fixtures: getMatchesByCompetition(state.matches.models),
	competitions: state.competitions.models,
})

export default connect(
	mapStateToProps,
	undefined,
)(FixtureTile);