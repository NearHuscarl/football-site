import React from 'react';

const Tile = (props) => (
    <div className='tile'>
        <div className='tile-title'>{props.name}</div>
        <div className='tile-body'>
            {props.children}
        </div>
    </div>
);

export default Tile;