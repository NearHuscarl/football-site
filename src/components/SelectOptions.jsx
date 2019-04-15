import React from 'react';
import Select from 'react-select';

const selectStyles = {
    control: (styles) => ({
        ...styles,
        minWidth: '53rem',
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
    option: (styles) => ({
        ...styles,
        fontFamily: 'Quicksand-Medium',
    }),
};

const SelectOptions = (props) => (
    <Select
        styles={selectStyles}
        {...props}
    />
)

export default SelectOptions;