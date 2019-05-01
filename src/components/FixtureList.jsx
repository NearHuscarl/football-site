import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import { competitionIds as competitionIdSet } from '../settings';

class FixtureList extends React.Component {
	renderFixtureItem = (match) => {
		const { teams } = this.props;
		const { competitionId, homeTeamId, awayTeamId } = match;
		if (isEmpty(teams[competitionId])) {
			return null;
		}
		const homeTeam = teams[competitionId][homeTeamId];
		const awayTeam = teams[competitionId][awayTeamId];

		return (
			<FixtureListItem
				key={match.id}
				fixture={match}
				homeTeam={homeTeam}
				awayTeam={awayTeam} />
		);
	}

	renderFixtureGroup = (matches) => {
		const { competitionName } = matches[0];

		return (
			<div key={competitionName}>
				<div className='header'>
					{competitionName}
				</div>
				{
					matches.map((match) => this.renderFixtureItem(match))
				}
			</div>
		);
	}

	renderFixtures = () => {
		const { matches } = this.props;
		const matchesByCompetition = {};
		const competitionIds = Object.values(competitionIdSet);

		matches.forEach((match) => {
			const { competitionId } = match;
			if (competitionIds.indexOf(competitionId) === -1) return;

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
				{
					this.renderFixtures()
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
