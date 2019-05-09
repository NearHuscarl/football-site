import React from 'react';
import NewsTile from './NewsTile';
import FixtureTile from './FixtureTile';
import StandingTile from './StandingTile';
import Tile from './Tile';

const TileGroup = () => (
	<div className='content-container'>
		<div className='container-between'>
			<Tile name='News'>
				<NewsTile />
			</Tile>
			<Tile name='Fixture'>
				<FixtureTile />
			</Tile>
			<Tile name='Standing'>
				<StandingTile />
			</Tile>
		</div>
	</div>
);

export default TileGroup;