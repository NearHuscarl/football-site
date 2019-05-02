import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StandingFilters from '../components/StandingFilters';
import StandingTable from '../components/StandingTable';
import TopScorerList from '../components/TopScorerList';
import Loader from '../components/Loader';
import { startSearchStanding } from '../actions/standingResult';

export class StandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchStanding();
	}

	render() {
		const { topScorers, standingResult } = this.props;
		const { competitionId, result, pending } = standingResult;

		return (
			<div>
				<StandingFilters />
				{(result.length > 0) ?
					<div className='content-container standing-page'>
						<StandingTable competitionId={competitionId} standing={result} loading={pending} />
						{topScorers ?
							<TopScorerList scorers={topScorers.scorers} />
							:
							<Loader height='40vh' />
						}
					</div>
					:
					<Loader height='40vh' />
				}
			</div>
		);
	}
}

StandingPage.propTypes = {
	startSearchStanding: PropTypes.func.isRequired,
	standingResult: PropTypes.shape({
		competitionId: PropTypes.number,
		result: PropTypes.arrayOf(PropTypes.object),
		pending: PropTypes.bool,
	}).isRequired,
	topScorers: PropTypes.shape({
		scorers: PropTypes.arrayOf(PropTypes.object),
	}),
};

StandingPage.defaultProps = {
	topScorers: undefined,
}

const mapStateToProps = (state) => ({
	topScorers: state.topScorers.models[state.standingResult.competitionId],
	standingResult: state.standingResult,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchStanding: () => dispatch(startSearchStanding()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StandingPage);