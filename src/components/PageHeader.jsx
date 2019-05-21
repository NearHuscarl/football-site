import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, children }) => (
	<div className='page-header'>
		<div className="content-container">
			{
				title && <div className='page-header__title'>{title}</div>
			}
			{children}
		</div>
	</div>
)

PageHeader.propTypes = {
	title: PropTypes.string,
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.node),
	]),
};

PageHeader.defaultProps = {
	title: '',
	children: null,
};

export default PageHeader;
