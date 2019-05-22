import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';
import startSearchMatches from '../actions/matchResults';
import Loader from '../components/Loader';
import { competitionModelPropTypes, matchPropTypes } from '../utilities/footballProptypes';

class FixturePage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	getMatchInfo = () => {
		const { competitions, matches } = this.props;
		
		return matches.map((m) => {
			const match = m;
			const { competition, homeTeam, awayTeam } = match;

			if (isEmpty(competitions[competition.id])) {
				return match;
			}
			match.homeTeam = competitions[competition.id].teams[homeTeam.id];
			match.awayTeam = competitions[competition.id].teams[awayTeam.id];
			return match;
		});
	}

	render() {
		const { competitions, pending } = this.props;
		const matches = this.getMatchInfo();

		return (
			<div>
				<FixtureListFilters />
				{pending ?
					<Loader height='40vh' />
					:					
					<FixtureList matches={matches} />
				}
			</div>
		)
	}
}

FixturePage.propTypes = {
	matches: PropTypes.arrayOf(matchPropTypes).isRequired,
	competitions: competitionModelPropTypes.isRequired,
	startSearchMatches: PropTypes.func.isRequired,
	pending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	matches: state.matchResults.results,
	competitions: state.competitions.models,
	pending: state.competitions.pending || state.matchResults.pending,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixturePage);
