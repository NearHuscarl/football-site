import React from 'react';
import PropTypes from 'prop-types';
import Select, { createFilter } from "react-select";
import makeAnimated from 'react-select/lib/animated';
import getMenuList from '../hoc/MenuList';

const selectStyles = (width, menuHeight, singleLineOption) => ({
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
		...(menuHeight ? {
			height: menuHeight,
			minHeight: menuHeight,
			maxHeight: menuHeight,
		} : {}),
	}),
	option: (styles) => ({
		...styles,
		...(singleLineOption ? {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		} : {}),
		fontFamily: 'Quicksand-Medium',
		height: '3.5rem',
		lineHeight: '3.5rem',
		padding: '0 1rem',
		margin: '0',
	}),
})

const SelectOptions = (props) => {
	const {
		animated,
		ignoreAccents,
		isClearable,
		menuHeight,
		singleLineOption,
		virtualized,
		virtualizedMenuHeight,
		width,
		...rest
	} = props;

	return (
		<Select
			filterOption={createFilter({ ignoreAccents })}
			styles={selectStyles(props.width, menuHeight, singleLineOption)}
			isClearable={isClearable}
			components={{
				...(animated ? makeAnimated() : {}),
				...(virtualized ? {
					MenuList: getMenuList(
						virtualizedMenuHeight,
						// listApproximatedLengthBreak
					),
				} : {}),
			}}
			{...rest}
		/>
	);
}

SelectOptions.propTypes = {
	animated: PropTypes.bool,
	ignoreAccents: PropTypes.bool,
	isClearable: PropTypes.bool,
	menuHeight: PropTypes.string,
	singleLineOption: PropTypes.bool,
	virtualized: PropTypes.bool,
	virtualizedMenuHeight: PropTypes.number,
	width: PropTypes.string,
};

SelectOptions.defaultProps = {
	animated: true,
	// Improve filtering performance
	// https://github.com/JedWatson/react-select/issues/3128#issuecomment-487256349
	ignoreAccents: false,
	isClearable: true,
	menuHeight: null,
	singleLineOption: false,
	virtualized: false,
	virtualizedMenuHeight: 21,
	width: '53rem',
};

export default SelectOptions;