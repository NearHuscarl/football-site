import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ children }) => {
	const score = children;
	let className = '';

	if (score < 45) {
		className = 'rating--0';
	} else if (score >= 45 && score < 50) {
		className = 'rating--45';
	} else if (score >= 50 && score < 55) {
		className = 'rating--50';
	} else if (score >= 55 && score < 60) {
		className = 'rating--55';
	} else if (score >= 60 && score < 65) {
		className = 'rating--60';
	} else if (score >= 65 && score < 70) {
		className = 'rating--65';
	} else if (score >= 70 && score < 75) {
		className = 'rating--70';
	} else if (score >= 75 && score < 80) {
		className = 'rating--75';
	} else if (score >= 80 && score < 85) {
		className = 'rating--80';
	} else if (score >= 85 && score < 90) {
		className = 'rating--85';
	} else if (score >= 90 && score < 95) {
		className = 'rating--90';
	} else if (score >= 95) {
		className = 'rating--95';
	}

	return <span className={`rating ${className}`}>{children}</span>;
}

Rating.propTypes = {
	children: PropTypes.number.isRequired,
};

export default Rating;