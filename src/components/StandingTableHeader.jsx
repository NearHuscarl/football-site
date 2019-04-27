import React from 'react';
import PropTypes from 'prop-types';

class StandingTableHeader extends React.Component {
	constructor(props) {
		super(props);
		this.sortMode = ['none', 'asc', 'desc'];
		this.currentSortIndex = 0;
		this.state = {
			sort: this.sortMode[this.currentSortIndex],
		};
	}

	onSortRequested = (event) => {
		this.currentSortIndex += 1;
		if (this.currentSortIndex >= this.sortMode.length) {
			this.currentSortIndex = 0;
		}

		this.setState(() => ({ sort: this.sortMode[this.currentSortIndex] }))
		this.props.progressSort(event.shiftKey);
	}

	getSortIndicator = () => {
		const { sort } = this.state;
		if (sort === 'asc') {
			return (<span>{' '}<i className='fa fa-long-arrow-up' /></span>);
		}
		if (sort === 'desc') {
			return (<span>{' '}<i className='fa fa-long-arrow-down' /></span>);
		}
		return null;
	}

	getHeaderStyle = () => {
		const { field } = this.props.column.colDef;
		const baseStyle = {
			fontFamily: 'Quicksand-Regular',
		};

		if (field === 'team') {
			return { ...baseStyle, textAlign: 'left' };
		}
		return { ...baseStyle, textAlign: 'center' };
	}

	render() {
		return (
			<div style={this.getHeaderStyle()}
				tabIndex={-1}
				onClick={this.onSortRequested}
				onKeyPress={this.onSortRequested}
				role='button'>
				{this.props.displayName}
				{this.getSortIndicator()}
			</div>
		);
	}
}

StandingTableHeader.propTypes = {
	column: PropTypes.shape({
		colDef: PropTypes.object,
	}).isRequired,
	progressSort: PropTypes.func.isRequired,
	displayName: PropTypes.string.isRequired,
};


export default StandingTableHeader;