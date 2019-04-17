import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import FixtureListItem from './FixtureListItem';
import { startSearchMatches } from '../actions/matchResults';

class FixtureList extends React.Component {
    constructor(props) {
        super(props);

        this.props.startSearchMatches();
    }

    renderFixtureItem = (fixture) => {
        const { teams } = this.props;
        const competitionId = fixture.competition.id;
        const homeId = fixture.homeTeam.id;
        const awayId = fixture.awayTeam.id;
        if (isEmpty(teams[competitionId])) {
            return null;
        }
        const homeTeam = teams[competitionId][homeId];
        const awayTeam = teams[competitionId][awayId];

        return (
            <FixtureListItem
                key={fixture.id}
                fixture={fixture}
                homeTeam={homeTeam}
                awayTeam={awayTeam} />
        );
    }

    render() {
        const { fixtures } = this.props;

        return (
            <div className='content-container'>
                <div>
                    <hr className='list-item-top-border' />
                    {fixtures.map((fixture) => this.renderFixtureItem(fixture))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    fixtures: state.matchResults.results,
    teams: state.teams,
})

const mapDispatchToProps = (dispatch) => ({
    startSearchMatches: () => {
        return dispatch(startSearchMatches());
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FixtureList);