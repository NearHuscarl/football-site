import React from 'react';
import PropTypes from 'prop-types';

const Loader = (props) => (
    <div className='loader' style={{ height: props.height }}>
        <div className={props.type}></div>
    </div>
);

Loader.propTypes = {
    type: PropTypes.string,
    height: PropTypes.string,
};

Loader.defaultProps = {
    type: 'dot-bricks',
    height: '6rem',
};

export default Loader;