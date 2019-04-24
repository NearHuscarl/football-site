import React from 'react';
import PropTypes from 'prop-types';

const Tile = (props) => (
	<div className='tile'>
		<div className='tile-title'>{props.name}</div>
		<div className='tile-body'>
			{props.children}
		</div>
	</div>
);

Tile.propTypes = {
	name: PropTypes.string.isRequired,
	children: PropTypes.element.isRequired,
};

export default Tile;