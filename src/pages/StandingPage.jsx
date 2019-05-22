import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import has from 'lodash/has';
import StandingFilters from '../components/StandingFilters';
import StandingTable from '../components/StandingTable';
import TopScorerList from '../components/TopScorerList';
import Loader from '../components/Loader';
import { startSearchStanding } from '../actions/standingResult';
import obsoleteFDTeamLogoIds from '../utilities/obsoleteFDTeamLogoIds';
import { competitionModelPropTypes, rankPropTypes, topScorerPropTypes } from '../utilities/footballProptypes';
import { historyPropTypes } from '../utilities/routerProptypes'

export class StandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.props.startSearchStanding();
	}

	render() {
		const { topScorers, standingResult, competitions, history } = this.props;
		const { competitionId, result, pending } = standingResult;
		const table = result.map((rank) => {
			const { team } = rank;
			if (has(obsoleteFDTeamLogoIds, team.id)) {
				team.crestUrl = competitions[competitionId].teams[team.id].crestUrl;
			}
			return rank;
		});

		return (
			<div>
				<StandingFilters />
				{(result.length > 0) ?
					<div className='content-container container-between'>
						<StandingTable history={history} competitionId={competitionId} standing={table} loading={pending} />
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
		result: PropTypes.arrayOf(rankPropTypes),
		pending: PropTypes.bool,
	}).isRequired,
	topScorers: topScorerPropTypes,
	competitions: competitionModelPropTypes.isRequired,
	history: historyPropTypes.isRequired,
};

StandingPage.defaultProps = {
	topScorers: undefined,
}

const mapStateToProps = (state) => ({
	topScorers: state.topScorers.models[state.standingResult.competitionId],
	standingResult: state.standingResult,
	competitions: state.competitions.models,
});

const mapDispatchToProps = (dispatch) => ({
	startSearchStanding: () => dispatch(startSearchStanding()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(StandingPage);