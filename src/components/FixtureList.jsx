import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import Loader from './Loader';
import { competitions } from '../settings';

class FixtureList extends React.Component {
	renderFixtureItem = (match) => {
		const { teams } = this.props;
		const competitionId = match.competition.id;
		const homeId = match.homeTeam.id;
		const awayId = match.awayTeam.id;
		if (isEmpty(teams[competitionId])) {
			return null;
		}
		const homeTeam = teams[competitionId][homeId];
		const awayTeam = teams[competitionId][awayId];

		return (
			<FixtureListItem
				key={match.id}
				fixture={match}
				homeTeam={homeTeam}
				awayTeam={awayTeam} />
		);
	}

	renderFixtureGroup = (matches) => {
		const competitionName = matches[0].competition.name;

		return (
			<div key={competitionName}>
				<div className='fixturelist-groupname'>
					{competitionName}
				</div>
				{
					matches.map((match) => this.renderFixtureItem(match))
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
		const { matches } = this.props;
		const matchesByCompetition = {};

		matches.forEach((match) => {
			const competitionId = match.competition.id;

			if (isEmpty(matchesByCompetition[competitionId])) {
				matchesByCompetition[competitionId] = [];
			}

			matchesByCompetition[competitionId].push(match);
		});

		return Object.keys(matchesByCompetition).map((competitionId) =>
			this.renderFixtureGroup(matchesByCompetition[competitionId]));
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
	matches: PropTypes.arrayOf(PropTypes.object).isRequired,
	teams: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default FixtureList;
