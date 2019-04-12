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
        };
        this.competitionIds = [
            tierOneCommpetitions.premierLeague,
            tierOneCommpetitions.primeraDivision,
            tierOneCommpetitions.bundesliga,
            tierOneCommpetitions.serieA,
        ];
    }

    componentDidMount() {
        this.competitionIds.forEach((competitionId) => {
            this.props.startUpdateStanding(competitionId);
        });
    }

    onClickStandingTable = (index) => {
        const { competitionIds } = this;
        history.push(`/standings/${competitionIds[index]}`);
    }

    // Avoid rerendering multiple table components when data are not ready
    isDataReady = () => {
        const { standings } = this.props;

        for (const competitionId of this.competitionIds) {
            if (!standings.hasOwnProperty(competitionId)) {
                return false;
            }
        }
        
        return true;
    }

    render() {
        const { competitionIds, props } = this;

        return (
            this.isDataReady() ?
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
                            competitionIds.map((competitionId) => {
                                const standing = props.standings[competitionId];
                                return <StandingTable className='tile-imageitem' key={competitionId} standing={standing} />
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
