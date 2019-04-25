import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';
import startSearchMatches from '../actions/matchResults';
import Loader from '../components/Loader';

class FixturePage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	render() {
		const { matches, teams, teamsPending } = this.props;

		return (
			<div>
				<FixtureListFilters />
				{teamsPending ?
					<Loader height='40vh' />
					:					
					<FixtureList
						matches={matches}
						teams={teams} />
				}
			</div>
		)
	}
}

FixturePage.propTypes = {
	matches: PropTypes.arrayOf(PropTypes.object).isRequired,
	teams: PropTypes.objectOf(PropTypes.object).isRequired,
	startSearchMatches: PropTypes.func.isRequired,
	teamsPending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	matches: state.matchResults.results,
	teams: state.teams.models,
	teamsPending: state.teams.pending.getTeamsPending,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixturePage);
