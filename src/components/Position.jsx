import React from 'react';
import PropTypes from 'prop-types';

const Position = ({ children, ...rest }) => {
	const position = children;
	let className = '';

	switch (position) {
		case 'ST':
		case 'LS':
		case 'RS':
		case 'CF':
		case 'LF':
		case 'RF':
		case 'LW':
		case 'RW':
			className = 'pos--attack';
			break;

		case 'CAM':
		case 'LAM':
		case 'RAM':
		case 'CM':
		case 'LCM':
		case 'RCM':
		case 'LM':
		case 'RM':
		case 'CDM':
		case 'LDM':
		case 'RDM':
			className = 'pos--midfield';
			break;

		case 'LWB':
		case 'RWB':
		case 'CB':
		case 'LCB':
		case 'RCB':
		case 'LB':
		case 'RB':
			className = 'pos--defence';
			break;

		case 'GK':
			className = 'pos--goalkeeper';
			break;

		case 'SUB':
		case 'RES':
			className = 'pos--misc';
			break;

		default:
			throw Error(`Unknown player position: ${position}`);
	}

	return <span className={`pos ${className}`} {...rest}>{children}</span>;
}

Position.propTypes = {
	children: PropTypes.string.isRequired,
};

export default Position;