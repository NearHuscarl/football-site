import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import compact from 'lodash/compact';
import upperFirst from 'lodash/upperFirst';

const EUR = '€';
const USD = '$';

class PlayerListHeader extends React.Component {
	constructor(props) {
		super(props);
		this.sortMode = ['none', 'asc', 'desc'];
		this.currentSortIndex = 0;
		this.state = {
			sort: this.sortMode[this.currentSortIndex],
			currency: USD,
		};
	}

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event 
	 */
	onSortRequested = (event) => {
		this.currentSortIndex += 1;
		if (this.currentSortIndex >= this.sortMode.length) {
			this.currentSortIndex = 0;
		}

		this.setState(() => ({ sort: this.sortMode[this.currentSortIndex] }))
		this.props.progressSort(event.shiftKey);
	}

	// '$157K' => '€139K'
	usdToEuro = (usdStr) => {
		const pieces = compact(usdStr.split(/(\$|K|M)/i));

		return pieces.map((piece) => {
			if (!Number.isNaN(Number(piece))) {
				return (piece * 0.89).toFixed(1); // TODO: use currency converter library
			}
			if (piece === USD) {
				return EUR;
			}
			return piece;
		}).join('');
	}

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event 
	 */
	onChangeCurrency = (event) => {
		event.stopPropagation();
		const { field } = this.props.column.colDef;
		const itemsToUpdate = [];
		const currency = this.state.currency === USD ? EUR : USD;
		this.setState(() => ({ currency }));

		this.props.api.forEachNodeAfterFilterAndSort((rowNode) => {
			const { data } = rowNode;
			const originField = 'origin' + upperFirst(field);

			if (!has(data, originField)) {
				data[originField] = data[field];
			}
			const usdValue = data[originField];

			if (currency === USD) {
				data[field] = usdValue;
			} else {
				data[field] = this.usdToEuro(usdValue);
			}
			itemsToUpdate.push(data);
		});

		this.props.api.updateRowData({ update: itemsToUpdate });
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

	render() {
		const { field } = this.props.column.colDef;
		const { currency } = this.state;

		return (
			<div style={{ fontFamily: 'Quicksand-Regular' }}
				tabIndex={-1}
				onClick={this.onSortRequested}
				onKeyPress={this.onSortRequested}
				role='button'>
				{this.props.displayName}
				{(field === 'value' || field === 'wage') &&
					<span>{' '}
						<button
							type='button'
							onClick={this.onChangeCurrency}
							className='button button--link-cyan'>{currency}</button>
					</span>
				}
				{this.getSortIndicator()}
			</div>
		);
	}
}

PlayerListHeader.propTypes = {
	column: PropTypes.shape({
		colDef: PropTypes.object,
	}).isRequired,
	api: PropTypes.objectOf(PropTypes.object).isRequired,
	progressSort: PropTypes.func.isRequired,
	displayName: PropTypes.string.isRequired,
};


export default PlayerListHeader;