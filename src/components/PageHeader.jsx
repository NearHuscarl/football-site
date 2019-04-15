import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, children }) => {
    return (
        <div className='page-header'>
            <div className="content-container">
                {
                    title && <div className='page-header__title'>{title}</div>
                }
                {children}
            </div>
        </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string,
};

PageHeader.defaultProps = {
    title: '',
};

export default PageHeader;
