import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import '../styles/components/_carousel.scss';
import _ from 'lodash';
import { tierOneCommpetitions } from '../settings';
import { startUpdateFixture } from '../actions/fixtures';
import { startUpdateTeam } from '../actions/teams';
import Loader from './Loader';

class FixtureTile extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {};
        this.competitionIds = [
            tierOneCommpetitions.premierLeague,
            tierOneCommpetitions.primeraDivision,
            tierOneCommpetitions.bundesliga,
            tierOneCommpetitions.serieA,
        ];
    }

    componentDidMount() {
        this.props.startUpdateFixture()
            .then(() => {
                this.competitionIds.forEach((competitionId) => {
                    this.props.startUpdateTeam(competitionId);
                })
            });
    }

    isDataReady = () => {
        const { fixtures, teams } = this.props;

        if (_.isEmpty(fixtures) || _.isEmpty(teams)) {
            return false;
        }

        for (const competitionId of this.competitionIds) {
            if (!teams.hasOwnProperty(competitionId)) {
                return false;
            }
            if (!fixtures.hasOwnProperty(competitionId)) {
                return false;
            }
        }

        return true;
    }

    renderFixtures = (competitionId) => {
        let components = [];
        const { fixtures, teams } = this.props;
        const randomFixtures = _.take(_.shuffle(fixtures[competitionId]), 4);

        randomFixtures.forEach((fixture) => {
            const homeId = fixture.homeTeam.id;
            const awayId = fixture.awayTeam.id;
            const homeTeam = teams[competitionId][homeId];
            const awayTeam = teams[competitionId][awayId];

            components.push((
                <div key={fixture.id}>{homeTeam.name} V {awayTeam.name}</div>
            ))
        });

        return (
            <div key={competitionId}>
                {components}
            </div>
        );
    }

    render() {
        return (this.isDataReady()
            ?
            <div className='carousel-wrapper'>
                <Carousel
                    width='34rem'
                    useKeyboardArrows
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    transitionTime={600}
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}>
                    {
                        this.competitionIds.map((competitionId) => {
                            return this.renderFixtures(competitionId);
                        })
                    }
                </Carousel>
            </div>
            :
            <Loader />
        );
    }
}

const mapStateToProps = (state) => ({
    fixtures: state.fixtures,
    teams: state.teams,
})

const mapDispatchToProps = (dispatch) => ({
    startUpdateFixture: () => {
        return dispatch(startUpdateFixture());
    },
    startUpdateTeam: (competitionId) => {
        return dispatch(startUpdateTeam(competitionId));
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FixtureTile);