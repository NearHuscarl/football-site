import PropTypes from 'prop-types';

export const historyPropTypes = PropTypes.shape({
	push: PropTypes.func,
	replace: PropTypes.func,
});

export const matchPropTypes = PropTypes.shape({
	params: PropTypes.object,
});