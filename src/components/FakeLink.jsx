import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const fakeLinkStyle = {
	textDecoration: 'none',
	color: 'initial',
};

const FakeLink = (props) => (
	<Link style={fakeLinkStyle} {...props}>{props.children}</Link>
);


FakeLink.propTypes = {
	children: PropTypes.element.isRequired,
};

export default FakeLink;