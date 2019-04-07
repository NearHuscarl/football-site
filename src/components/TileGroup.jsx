import React from 'react';
import StandingTile from './StandingTile';
import NewsTile from './NewsTile';
import Tile from './Tile';

const TileGroup = () => (
    <div className='content-container'>
        <div className='tile-group'>
            <Tile name='News'>
                <NewsTile />
        </Tile>
            <Tile name='Fixture'>
                Fixture
        </Tile>
            <Tile name='Standing'>
                <StandingTile />
            </Tile>
        </div>
    </div>
);

export default TileGroup;