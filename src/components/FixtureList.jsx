import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import { competitionIds as competitionIdSet } from '../settings';
import { matchPropTypes } from '../utilities/footballProptypes';

class FixtureList extends React.Component {
	renderFixtureGroup = (matches) => {
		const { competition } = matches[0];

		return (
			<div key={competition.name}>
				<div className='header'>
					{competition.name}
				</div>{
					matches.map((match) => <FixtureListItem key={match.id} fixture={match} />)
				}
			</div>
		);
	}

	getMatchesByCompetition = () => {
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

		return matchesByCompetition;
	}

	render() {
		const matchesByCompetition = this.getMatchesByCompetition()

		return (
			<div className='content-container'>{
				Object.keys(matchesByCompetition).map((competitionId) =>
					this.renderFixtureGroup(matchesByCompetition[competitionId]))
			}
			</div>
		);
	}
}

FixtureList.propTypes = {
	matches: PropTypes.arrayOf(matchPropTypes).isRequired,
};

export default FixtureList;
