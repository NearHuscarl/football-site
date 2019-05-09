import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ score, maxScore }) => {
	if (score < 0 || score > maxScore) {
		throw Error(`Star count must be from 0 to ${maxScore}`);
	}

	const stars = score * 5 / maxScore;
	const fullStarCount = Math.floor(stars)
	const components = [];
	
	for (let i = 0; i < 5; i+=1) {
		if (i < fullStarCount) {
			components.push(<i key={i} className='fa fa-star' />);
		} else if (i === fullStarCount) {
			const starDiff = stars - fullStarCount;

			if (starDiff <= 0.25) {
				components.push(<i key={components.length} className='fa fa-star-o' />);
			} else if (starDiff > 0.25 && starDiff < 0.75) {
				components.push(<i key={components.length} className='fa fa-star-half-o' />);
			} else if (starDiff >= 0.75) {
				components.push(<i key={components.length} className='fa fa-star' />);
			}
		} else {
			components.push(<i key={components.length} className='fa fa-star-o' />);
		}
	}

	return components;
}

StarRating.propTypes = {
	score: PropTypes.number.isRequired,
	maxScore: PropTypes.number,
};

StarRating.defaultProps = {
	maxScore: 5,
};

export default StarRating;