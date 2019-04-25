import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ alt, defaultImage, ...props }) => (
	<img
		onError={(e) => {
			e.target.onerror = null;
			if (defaultImage) {
				e.target.src = defaultImage;
			}
		}}
		alt={alt}
		{...props} />
);

Image.propTypes = {
	alt: PropTypes.string.isRequired,
	defaultImage: PropTypes.string,
};

Image.defaultProps = {
	defaultImage: null,
};

export default Image;