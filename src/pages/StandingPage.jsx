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
		const { competitionId, standing, topScorers, searchPending } = this.props;

		return (
			<div>
				<StandingFilters />
				{(standing.length > 0 && !searchPending) ?
					<div className='content-container standing-page'>
						<StandingTable competitionId={competitionId} standing={this.props.standing} />
						{topScorers ?
							<TopScorerList
								competition={topScorers.competition.name}
								scorers={topScorers.scorers} />
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
	competitionId: PropTypes.number.isRequired,
	standing: PropTypes.arrayOf(PropTypes.object).isRequired,
	topScorers: PropTypes.shape({
		competition: PropTypes.object,
		scorers: PropTypes.arrayOf(PropTypes.object),
	}),
	searchPending: PropTypes.bool.isRequired,
};

StandingPage.defaultProps = {
	topScorers: undefined,
}

const mapStateToProps = (state) => ({
	topScorers: state.topScorers.models[state.standingResult.competitionId],
	competitionId: state.standingResult.competitionId,
	standing: state.standingResult.result,
	searchPending: state.standingResult.pending,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchStanding: () => dispatch(startSearchStanding()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StandingPage);