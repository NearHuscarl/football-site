import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';
import startSearchMatches from '../actions/matchResults';

class FixturePage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	render() {
		const { matches, teams } = this.props;

		return (
			<div>
				<FixtureListFilters />
				<FixtureList
					matches={matches}
					teams={teams} />
			</div>
		)
	}
}

FixturePage.propTypes = {
	matches: PropTypes.arrayOf(PropTypes.object).isRequired,
	teams: PropTypes.objectOf(PropTypes.object).isRequired,
	startSearchMatches: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	matches: state.matchResults.results,
	teams: state.teams,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixturePage);
