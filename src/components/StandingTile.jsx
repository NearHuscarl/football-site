import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import StandingTable from './StandingTable';
import { tierOneCommpetitions } from '../settings';
import '../styles/components/_carousel.scss';
import { history } from '../routers/AppRouter';

class StandingTile extends React.Component {
    constructor(props) {
        super(props);

        this.competitionIds = [
            tierOneCommpetitions.premierLeague,
            tierOneCommpetitions.primeraDivision,
            tierOneCommpetitions.bundesliga,
            tierOneCommpetitions.serieA,
        ];
    }

    onClickStandingTable = (index) => {
        const { competitionIds } = this;
        history.push(`/standings/${competitionIds[index]}`);
    }

    render() {
        const { competitionIds } = this;

        return (
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
                            <StandingTable key={competitionId} competitionId={competitionId} />
                        ))
                    }
                </Carousel>
            </div>
        );
    }
}

export default StandingTile;