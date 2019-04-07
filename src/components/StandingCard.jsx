import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import StandingTable from './StandingTable';
import { tierOneCommpetitions } from '../settings';
import '../styles/components/_carousel.scss';
import { history } from '../routers/AppRouter';

class StandingCard extends React.Component {
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
            <div className='card-small'>
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
                        <StandingTable competitionId={competitionIds[0]} />
                        <StandingTable competitionId={competitionIds[1]} />
                        <StandingTable competitionId={competitionIds[2]} />
                        <StandingTable competitionId={competitionIds[3]} />
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default StandingCard;