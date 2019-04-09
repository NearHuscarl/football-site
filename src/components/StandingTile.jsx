import React from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import { tierOneCommpetitions } from '../settings';
import '../styles/components/_carousel.scss';
import { history } from '../routers/AppRouter';
import 'three-dots/sass/three-dots.scss'
import { startUpdateStanding } from '../actions/standings';
import StandingTable from './StandingTable';
import Loader from './Loader';

export class StandingTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            standings: {},
            isDataReady: false,
        };
        this.competitionIds = [
            tierOneCommpetitions.premierLeague,
            tierOneCommpetitions.primeraDivision,
            tierOneCommpetitions.bundesliga,
            tierOneCommpetitions.serieA,
        ];
    }

    componentDidMount() {
        let promises = [];

        this.competitionIds.forEach((competitionId) => {
            promises.push(this.props.startUpdateStanding(competitionId));
        });

        Promise.all(promises)
            .then(() => this.setState(() => ({ isDataReady: true })));
    }

    onClickStandingTable = (index) => {
        const { competitionIds } = this;
        history.push(`/standings/${competitionIds[index]}`);
    }

    render() {
        const { competitionIds, props } = this;

        return (
            this.state.isDataReady ?
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
                        showStatus={false}
                        onClickItem={this.onClickStandingTable}>
                        {
                            competitionIds.map((competitionId) => (
                                <StandingTable key={competitionId} standing={props.standings[competitionId]} />
                            ))
                        }
                    </Carousel>
                </div>
                :
                <Loader />
        );
    }
}

const mapStateToProps = (state) => ({
    standings: state.standings,
})

const mapDispatchToProps = (dispatch) => ({
    startUpdateStanding: (competitionId) => {
        return dispatch(startUpdateStanding(competitionId));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(StandingTile);
