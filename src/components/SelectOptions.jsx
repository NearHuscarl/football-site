import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const selectStyles = (width) => ({
	control: (styles) => ({
		...styles,
		minWidth: width,
	}),
	valueContainer: (styles) => ({
		...styles,
		paddingLeft: '4px',
		height: '4rem',
	}),

	multiValueLabel: (styles) => ({
		...styles,
		fontFamily: 'Quicksand-Medium',
	}),
	menuList: (styles) => ({
		...styles,
		maxHeight: '50rem',
	}),
	option: (styles) => ({
		...styles,
		fontFamily: 'Quicksand-Medium',
	}),
});

const SelectOptions = (props) => (
	<Select
		styles={selectStyles(props.width)}
		components={makeAnimated()}
		{...props}
	/>
)

SelectOptions.propTypes = {
	width: PropTypes.string,
	// height: PropTypes.string,
};

SelectOptions.defaultProps = {
	width: '53rem',
};

export default SelectOptions;