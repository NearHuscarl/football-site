import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';
import startSearchMatches from '../actions/matchResults';
import Loader from '../components/Loader';
import { teamModelPropTypes, matchPropTypes } from '../utilities/footballProptypes';

class FixturePage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	render() {
		const { matchResults, teams, pending } = this.props;

		return (
			<div>
				<FixtureListFilters />
				{(pending || matchResults.pending) ?
					<Loader height='40vh' />
					:					
					<FixtureList
						matches={matchResults.results}
						teams={teams} />
				}
			</div>
		)
	}
}

FixturePage.propTypes = {
	matchResults: PropTypes.shape({
		results: PropTypes.arrayOf(matchPropTypes).isRequired,
		pending: PropTypes.bool,
	}).isRequired,
	teams: teamModelPropTypes.isRequired,
	startSearchMatches: PropTypes.func.isRequired,
	pending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	matchResults: state.matchResults,
	teams: state.teams.models,
	pending: state.teams.pending,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixturePage);
