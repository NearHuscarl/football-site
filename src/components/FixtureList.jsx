import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import Loader from './Loader';
import startSearchMatches from '../actions/matchResults';
import { competitions } from '../settings';

// TODO: convert into presentation props (move connect upward)
class FixtureList extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	renderFixtureItem = (fixture) => {
		const { teams } = this.props;
		const competitionId = fixture.competition.id;
		const homeId = fixture.homeTeam.id;
		const awayId = fixture.awayTeam.id;
		if (isEmpty(teams[competitionId])) {
			return null;
		}
		const homeTeam = teams[competitionId][homeId];
		const awayTeam = teams[competitionId][awayId];

		return (
			<FixtureListItem
				key={fixture.id}
				fixture={fixture}
				homeTeam={homeTeam}
				awayTeam={awayTeam} />
		);
	}

	renderFixtureGroup = (fixtures) => {
		const competitionName = fixtures[0].competition.name;

		return (
			<div key={competitionName}>
				<div className='fixturelist-groupname'>
					{competitionName}
				</div>
				{
					fixtures.map((fixture) => this.renderFixtureItem(fixture))
				}
			</div>
		);
	}

	isDataReady = () => {
		const { teams } = this.props;
		return Object.values(competitions)
			.every((competitionId) => !isEmpty(teams[competitionId]));
	}

	renderFixtures = () => {
		const { fixtures } = this.props;
		const fixturesByCompetition = {};

		fixtures.forEach((fixture) => {
			const competitionId = fixture.competition.id;

			if (isEmpty(fixturesByCompetition[competitionId])) {
				fixturesByCompetition[competitionId] = [];
			}

			fixturesByCompetition[competitionId].push(fixture);
		});

		return Object.keys(fixturesByCompetition).map((competitionId) =>
			this.renderFixtureGroup(fixturesByCompetition[competitionId]));
	}

	render() {
		return (
			<div className='content-container'>
				{this.isDataReady() ?
					this.renderFixtures()
					:
					<Loader height='40vh' />
				}
			</div>
		);
	}
}

FixtureList.propTypes = {
	fixtures: PropTypes.arrayOf(PropTypes.object).isRequired,
	teams: PropTypes.objectOf(PropTypes.object).isRequired,
	startSearchMatches: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	fixtures: state.matchResults.results,
	teams: state.teams,
})

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixtureList);