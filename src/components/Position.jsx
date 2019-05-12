import React from 'react';
import PropTypes from 'prop-types';

const getClassNameFromPosition = (position) => {
	switch (position) {
		case 'ST':
		case 'LS':
		case 'RS':
		case 'CF':
		case 'LF':
		case 'RF':
		case 'LW':
		case 'RW':
			return 'pos--attack';

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
			return 'pos--midfield';

		case 'LWB':
		case 'RWB':
		case 'CB':
		case 'LCB':
		case 'RCB':
		case 'LB':
		case 'RB':
			return 'pos--defence';

		case 'GK':
			return 'pos--goalkeeper';

		case 'SUB':
		case 'RES':
			return 'pos--misc';

		default:
			throw Error(`Unknown player position: ${position}`);
	}
}

const Position = ({ children, ...rest }) => {
	let positions = [];

	if (!Array.isArray(children)) {
		positions = children.split(',');
	} else {
		positions = children;
	}

	return (
		<span {...rest}>
			{positions.map((position, index) => {
				const comma = index !== positions.length - 1 ? ', ' : '';
				return (
					<span key={position} className={`pos ${getClassNameFromPosition(position)}`}>
						{position + comma}
					</span>
				);
			})}
		</span>
	);
}

Position.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]).isRequired,
};

export default Position;