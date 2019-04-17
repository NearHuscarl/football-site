import React from 'react';
import moment from 'moment';

const FixtureListItem = ({ fixture, homeTeam, awayTeam }) => {
    const date = moment.utc(fixture.utcDate).format('HH:mm');

    return (
        <div className='fixturelist-item' key={fixture.id}>
            <div className='fixture-item__logo' >
                <img alt='home team' src={homeTeam.crestUrl} />
            </div>
            <div className='fixture-item__info'>
                <span className='fixture-item__team-home'>
                    {homeTeam.name}
                </span>
                <span className='fixture-item__vs'>
                    {
                        fixture.status === 'SCHEDULED' ?
                            date
                            :
                            `${fixture.score.fullTime.homeTeam} - ${fixture.score.fullTime.awayTeam}`
                    }
                </span>
                <span className='fixture-item__team-away'>
                    {awayTeam.name}
                </span>
            </div>
            <div className='fixture-item__logo' >
                <img alt='away team' src={awayTeam.crestUrl} />
            </div>
        </div>
    );
}

export default FixtureListItem;