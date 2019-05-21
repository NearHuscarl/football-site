import PropTypes from 'prop-types';

const playerFiltersPropTypes = PropTypes.shape({
	query: PropTypes.string,
	nationality: PropTypes.string,
	team: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
	}),
	position: PropTypes.string,
	minRating: PropTypes.number,
	maxRating: PropTypes.number,
	minPotential: PropTypes.number,
	maxPotential: PropTypes.number,
	minAge: PropTypes.number,
	maxAge: PropTypes.number,
	preferredFoot: PropTypes.string,
});

export default playerFiltersPropTypes;