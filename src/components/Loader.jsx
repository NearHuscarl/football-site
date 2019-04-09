import React from 'react';
import PropTypes from 'prop-types';

const Loader = (props) => (
    <div className='loader'>
        <div className={props.type}></div>
    </div>
);

Loader.propTypes = {
    type: PropTypes.string,
};

Loader.defaultProps = {
    type: 'dot-bricks',
};

export default Loader;