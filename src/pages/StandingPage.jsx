import React from 'react';
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
        const { standing, topScorers, searchPending } = this.props;

        return (
            <div>
                <StandingFilters />
                {(standing.length > 0 && !searchPending) ?
                    <div className='content-container standing-page'>
                        <StandingTable standing={this.props.standing} />
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

const mapDispatchToProps = (dispatch) => ({
    startSearchStanding: () => dispatch(startSearchStanding()),
});

const mapStateToProps = (state) => ({
    topScorers: state.topScorers[state.standingResult.competitionId],
    standing: state.standingResult.result,
    searchPending: state.standingResult.pending,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StandingPage);