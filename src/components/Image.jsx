import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ alt, src, defaultImage, ...props }) => (
	<img
		onError={(e) => {
			e.target.onerror = null;
			if (defaultImage) {
				e.target.src = defaultImage;
			}
		}}
		alt={alt}
		src={src || defaultImage}
		{...props} />
);

Image.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string.isRequired,
	defaultImage: PropTypes.string,
};

Image.defaultProps = {
	src: '',
	defaultImage: null,
};

export default Image;