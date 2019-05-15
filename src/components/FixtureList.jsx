import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import { competitionIds as competitionIdSet } from '../settings';
import { matchPropTypes, teamModelPropTypes } from '../utilities/footballProptypes';

class FixtureList extends React.Component {
	renderFixtureItem = (match) => {
		const { teams } = this.props;
		const { competition, homeTeam, awayTeam } = match;
		if (isEmpty(teams[competition.id])) {
			return null;
		}
		const homeTeamDetail = teams[competition.id][homeTeam.id];
		const awayTeamDetail = teams[competition.id][awayTeam.id];

		return (
			<FixtureListItem
				key={match.id}
				fixture={match}
				homeTeam={homeTeamDetail}
				awayTeam={awayTeamDetail} />
		);
	}

	renderFixtureGroup = (matches) => {
		const { competition } = matches[0];

		return (
			<div key={competition.name}>
				<div className='header'>
					{competition.name}
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
			const competitionId = match.competition.id;
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
			<div className='content-container'>{
				this.renderFixtures()
			}
			</div>
		);
	}
}

FixtureList.propTypes = {
	matches: PropTypes.arrayOf(matchPropTypes).isRequired,
	teams: teamModelPropTypes.isRequired,
};

export default FixtureList;
