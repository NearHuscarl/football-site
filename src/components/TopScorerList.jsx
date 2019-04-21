import React from 'react';
import take from 'lodash/take';

class TopScorerList extends React.Component {
    constructor(props) {
        super(props);
    }

    renderScorerItem = (scorer) => {
        return (
            <div key={scorer.player.name} className='top-scorer-item'>
                <div className='top-scorer-item__name'>
                    <span className='bold'>Name:</span>{' '}
                    {scorer.player.name}
                </div>
                <div className='top-scorer-item__info'>
                    <span className='bold'>Position:</span>{' '}
                    {scorer.player.position}
                </div>
                <div className='top-scorer-item__name'>
                    <span className='bold'>Team:</span>{' '}
                    {scorer.team.name}
                </div>
                <div className='top-scorer-item__name'>
                    <span className='bold'>Goals:</span>{' '}
                    {scorer.numberOfGoals}
                </div>
            </div>
        );
    }
    
    render() {
        const { scorers, competition } = this.props;
        console.log(scorers);

        return (
            <div className='top-scorer-list'>
                <div className='top-scorer__header'>
                    {`Top Scorers - ${competition}`}
                </div>
               {
                   take(scorers, 4).map((scorer) => this.renderScorerItem(scorer))
               }
            </div>
        );
    }
}

export default TopScorerList;