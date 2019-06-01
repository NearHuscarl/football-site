import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FixtureListFilters from '../components/FixtureListFilters';
import FixtureList from '../components/FixtureList';
import startSearchMatches from '../actions/matchResults';
import Loader from '../components/Loader';
import { matchPropTypes } from '../utilities/footballProptypes';

class FixturePage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchMatches();
	}

	render() {
		const { pending } = this.props;
		const { matches } = this.props;

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
	startSearchMatches: PropTypes.func.isRequired,
	pending: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	matches: state.matchResults.results,
	pending: state.competitions.pending || state.matchResults.pending,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchMatches: () => dispatch(startSearchMatches()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FixturePage);
